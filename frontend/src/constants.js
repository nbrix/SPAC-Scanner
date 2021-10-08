let DEBUG = true;
let host = "http://127.0.0.1:8000";
let stripePublishKey =
  "pk_test_51HzUbkAAhhtPVWyobAKsybX5bSwvPumr3MxZP5QdBJIMVfpiOIB5PtsSejr69b4WlBmspgjR49vH8ryf5hRDYw5F00aJL02a9z";

if (!DEBUG) {
  host = "https://spacscanner.com";
  stripePublishKey =
    "pk_live_51HzUbkAAhhtPVWyoPxDW4J4mH7bbZXZapsXS065MzRqbNnPE0J7OWxgkc6J8ONkMGIIn9TGpYlLBygMZsg3JXDiY00F7kAg9CF";
}

export { host };
export { stripePublishKey };

export const APIEndpoint = `${host}/api/v1`;
export const ChangeEmailURL = `${APIEndpoint}/change-email/`;
export const EmailURL = `${APIEndpoint}/email/`;
export const ChangePasswordURL = `${APIEndpoint}/change-password/`;
export const BillingURL = `${APIEndpoint}/billing/`;
export const SubscribeURL = `${APIEndpoint}/subscribe/`;
export const CancelSubscriptionURL = `${APIEndpoint}/cancel-subscription/`;
export const AddPortfolioURL = `/add-portfolio/`;
export const RemovePortfolioURL = `/remove-portfolio/`;
