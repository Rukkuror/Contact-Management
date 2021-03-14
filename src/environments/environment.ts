const baseURL = "http://localhost:3000/";

export const environment = {
  production: false,
  companyList: [
    { name: "Disney" },
    { name: "HP" },
    { name: "Microsoft" },
    { name: "IBM" },
    { name: "Google" }
  ],
  contactsUrl: baseURL.concat('contacts/')
};