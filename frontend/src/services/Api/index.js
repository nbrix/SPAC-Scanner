import { host } from "../../constants";

export const APIEndpoint = `${host}/api/v1`;

// Account
export const ChangeEmailURL = `${APIEndpoint}/change-email/`;
export const EmailURL = `${APIEndpoint}/email/`;
export const ChangePasswordURL = `${APIEndpoint}/change-password/`;
export const BillingURL = `${APIEndpoint}/billing/`;
export const SubscribeURL = `${APIEndpoint}/subscribe/`;
export const CancelSubscriptionURL = `${APIEndpoint}/cancel-subscription/`;

// News
export const AllNewsURL = `${APIEndpoint}/all-news/`;
export const DetailNewsURL = `${APIEndpoint}/news/`;

// Snapshots
export const GainersURL = `${APIEndpoint}/gainers/`;
export const LosersURL = `${APIEndpoint}/losers/`;
export const MostActiveURL = `${APIEndpoint}/most-active/`;

// Company
export const ManagementURL = `${APIEndpoint}/management/?ticker=`;
export const CompanyDetailsURL = `${APIEndpoint}/details/`;
export const AllCompaniesURL = `${APIEndpoint}/all-companies/`;
export const TargetURL = `${APIEndpoint}/target/?ticker=`;
export const AllSpacsURL = `${APIEndpoint}/all-spacs/`;

// Quote
export const QuoteURL = `${APIEndpoint}/quote/`;
export const ExchangeURL = `${APIEndpoint}/exchange/`;
export const SparklineURL = `${APIEndpoint}/sparkline/`;

// SEC Filings
export const SecFilingsURL = `${APIEndpoint}/sec-filings/`;
export const SecFilingsTickerURL = `${APIEndpoint}/sec-filings/?ticker=`;

// Portfolio
export const AddPortfolioURL = `/add-portfolio/`;
export const RemovePortfolioURL = `/remove-portfolio/`;
export const PortfolioURL = `${APIEndpoint}/portfolio/`;










