const TypesenseClient = require("./client");

const businessSchema = {
  name: "business",
  fields: [
    { name: "merchant_id", type: "string" },
    { name: "business_name", type: "string" },
    { name: "business_desc", type: "string" },
    { name: "business_rating", type: "int32" },
    { name: "services_remote", type: "bool" },
    { name: "services_inStore", type: "bool" },
    { name: "services_houseCall", type: "bool" },
    { name: "services_pickDrop", type: "bool" },
    { name: "business_exp", type: "int32" },
    { name: "emp_strength", type: "int32" },
    { name: "payment_card", type: "bool" },
    { name: "payment_paypal", type: "bool" },
    { name: "payment_apple", type: "bool" },
    { name: "payment_google", type: "bool" },
    { name: "payment_cash", type: "bool" },
    { name: "payment_crypto", type: "bool" },
    // { name: "authors", type: "string[]", facet: true },
    // { name: "image_url", type: "string" },
    // { name: "publication_year", type: "int32", facet: true },
    // { name: "ratings_count", type: "int32" },
    // { name: "average_rating", type: "float" },
  ],
  default_sorting_field: "business_rating",
};

TypesenseClient.collections()
  .create(businessSchema)
  .then(
    (data) => {},
    (err) => {}
  );
