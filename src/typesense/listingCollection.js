const TypesenseClient = require("./client");
const BusinessDetails = require("../models/merchant/schema/business.mongo");

const listingSchema = {
  name: "listing",
  fields: [
    { name: ".*", type: "auto" },
    // { name: "merchant_id", type: "string" },
    // { name: "business_name", type: "string" },
    // { name: "business_rating", type: "int32" },
    // { name: "rating_count", type: "int32" },
    // { name: "exp_years", type: "int32" },
    // { name: "emp_strength", type: "int32" },
    // { name: "is_service_247", type: "bool" },
    // { name: "service_name", type: "string" },
    // { name: "service_category", type: "string" },
    // { name: "pricing_type", type: "string" },
    // { name: "service_desc", type: "string" },
    // { name: "id", type: "string" },
    // { name: "service_type", type: "string", optional: true },
    // { name: "service_price", type: "string" },
    // { name: "business_location", type: "geopoint" },
    // { name: "merchant_slug", type: "string" },
    // { name: "primary_logo", type: "string", optional: true },
    // { name: "secondary_logo", type: "string", optional: true },
  ],
  // default_sorting_field: "business_rating",
};

TypesenseClient.collections()
  .create(listingSchema)
  .then(
    (data) => {},
    (err) => {
      console.log("typesense error", err);
    }
  );
