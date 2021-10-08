import requests 
import re
from bs4 import BeautifulSoup 
import unicodedata
import RegexPatterns as pattern

class S1Scraper:
	def __init__(self, url):
		self.url = url
		self.soup = BeautifulSoup(requests.get(url).content, 'html.parser')
		self.clean_regex = re.compile(' +')

	def get_ticker_symbols(self):
		sentence_pattern = ".*(under the symbols)(?=[\s.?!])[^.?!]*[.?!]"
		symbol_pattern = "[“\"](([A-Z]+[\. ]?){4,7})[,”\"]"

		matches = self.soup.find_all(text=re.compile(sentence_pattern))

		symbols = []
		result = {'common' : '', 'units' : '', 'warrants' : '', 'rights' : ''}
		for symbols_text in matches:
			symbols = re.findall(symbol_pattern, symbols_text)

			if symbols:
				symbols = [x[0] for x in symbols]
			
			for symbol in symbols:
				symbol = self.clean_symbol(symbol)

				if self.is_common(symbol):
					result['common'] = symbol
				if self.is_unit(symbol):
					result['units'] = symbol
				if self.is_warrant(symbol):
					result['warrants'] = symbol
				if self.is_right(symbol):
					result['rights'] = symbol

		return result

	def get_management_members(self):
		management = []

		table = self.soup.select('table:contains("Age","Name")')

		# Get header Row
		rows = table[0].find_all("tr")

		for row in rows[1:]:
			member = {}
			cells = row.find_all("td")

			pattern = '\w+'
			match = re.compile(pattern)
			member_cells = []
			for cell in cells:
				if match.search(cell.get_text()):
					member_cells.append(self.clean_string(cell.get_text()))

			if cells and member_cells[0] != 'Name':
				member['Name'] = member_cells[0]
				member['Age'] = member_cells[1]
				member['Position'] = member_cells[2]
				member['Profile'] = None
				management.append(member)

		if management:
			management = self.get_management_profiles(management, table[0])

		return management

	def get_management_profiles(self, management, first_elem):

		def find_next_useful_elem(match, next_elem):
			while not match.search(next_elem):
				next_elem = next_elem.find_next(text=True)
			return next_elem

		def is_page_break(string):
			pn_match = pattern.page_break().search(string)
			toc_match = pattern.table_of_contents().search(string)

			return pn_match or toc_match

		page_break_match = pattern.page_break()
		end_segment_match = pattern.management_end()

		# Find last element of member table. Right before profiles begin.
		name_match = pattern.last_member_name(management)
		next_elem = find_next_useful_elem(name_match, first_elem.find_next(text=True))

		# Find the beginning of profile descriptions
		name_match = pattern.first_member_name(management)
		next_elem = find_next_useful_elem(name_match, next_elem)

		for member in management:
			# Find beginning of member profile
			name_match = re.compile(pattern.management_name(member['Name']))
			any_other_name_match = pattern.any_other_names(member['Name'], management)
			next_elem = find_next_useful_elem(name_match, next_elem)

			# The member name
			member['Profile'] = next_elem + ' '

			# Get next element, if it is a page break, continue until it is not; if it is a new section do nothing;
			# otherwise add to profile
			next_elem = next_elem.find_next(text=True)

			# If next element does not contain the next member's name, is not part of the next section, or
			# is not a page break - add to member's profile.
			while (not end_segment_match.search(self.clean_string(next_elem)) and 
				not any_other_name_match.search(self.clean_string(next_elem))):

				if not is_page_break(self.clean_string(next_elem)):
					member['Profile'] += self.clean_string(next_elem) + ' '
				next_elem = next_elem.find_next(text=True)

		

		return management


	def get_legal_team(self):
		legal_pattern = pattern.legal_heading()
		legal_matters = self.soup.find_all(text=legal_pattern)



		legal_text = ""
		for match in legal_matters:
			next_elem = match.find_next(text=True)
			while next_elem and len(next_elem) < 20:
				next_elem = next_elem.find_next(text=True)

			legal_text = next_elem


		legal_pattern = pattern.legal_team()
		legal = legal_pattern.findall(self.clean_string(legal_text))

		for match in legal:
			print(match[0])

		return legal


	def clean_symbol(self, symbol):
		symbol.strip()
		if symbol[-1] == '.':
			symbol = symbol[:-1]
		return symbol

	def clean_string(self, string):
		string = string.replace('\n','')
		string = string.replace('\t',' ')
		string = self.clean_regex.sub(' ', string)
		result = unicodedata.normalize('NFKC', string)
		result = result.strip()
		return result

	def is_unit(self, symbol):
		return len(symbol) > 4 and (symbol[-1] == 'U' or symbol[-2] == 'U')

	def is_warrant(self, symbol):
		return len(symbol) > 4 and (symbol[-1] == 'W' or symbol[-2] == 'W')

	def is_common(self, symbol):
		return len(symbol) == 4

	def is_right(self, symbol):
		return len(symbol) > 4 and symbol[-1] == 'R'
