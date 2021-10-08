from django import forms
from .models import Management, Company


class CompanyChangeListForm(forms.ModelForm):

    # here we only need to define the field we want to be editable
    management = forms.ModelMultipleChoiceField(queryset=Management.objects.all(), 
        required=False)