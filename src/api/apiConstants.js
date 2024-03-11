//authentication
export const LOGIN = "/api/v1/auth/login";

//chefs 
export const GET_ALL_CHEF = "/api/v1/chefs/all";
//users
export const GET_ALL_USERS = "/api/v1/accounts";
export const DATA_OF_USERS = "/api/v1/accounts/update-account";

//orders
export const DATA_OF_ORDERS = "/api/orders";
export const GET_ALL_ORDERS = "/api/orders";


//posts
export const GET_ALL_POST = "/api/v1/posts/all";
export const DATA_OF_POST = "/api/v1/posts";

//patients
export const GET_ALL_PATIENTS = "/api/v1/patients";
export const DATA_OF_PATIENTS = "/api/v1/patients";

//Total patients
export const GET_TOTAL_PATIENTS = "/api/v1/patients/totals";

//pills
export const GET_ALL_PILLS = "/api/v1/pills";
export const DATA_OF_PILLS = "/api/v1/pills/update-pill";
//Expense/months
export const GET_ALL_EXPENSES_PER_MONTHS = "/api/transactionhistories/get-all/expense/months";

//Revenue/months
export const GET_ALL_REVENUE_PER_MONTHS = "/api/transactionhistories/get-all/revenue/months";

//Total Expense/months
export const GET_TOTAL_EXPENSES_PER_MONTHS = "api/transactionhistories/get-all/expense/months/totals";

//Total Revenue/months
export const GET_TOTAL_REVENUE_PER_MONTHS = "api/transactionhistories/get-all/revenue/months/totals";

//Total users
export const GET_TOTAL_USERS = "/api/v1/accounts/totals";

//User/months
export const GET_USERS_PER_MONTHS = "/api/v1/accounts/user/month";

//Total packages sold
export const GET_TOTAL_PACKAGES_SOLD = "/api/customerpackages/totals";