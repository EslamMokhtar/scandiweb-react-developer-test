const GET_CATEGORY = (cid) => {
  const GET_CATEGORY = {
    query: `
        {
            category(input: { title: "${cid}" }) {
              name
              products {
                id
                name
                inStock
                gallery
                brand
                attributes{
                  name
                  type
                  id
                  items{
                    id
                    displayValue
                    value
                  }
                }
                prices {
                  currency {
                    label
                    symbol
                  }
                  amount
                }
              }
            }
          }
      
        `,
  };
  return GET_CATEGORY;
};

export default GET_CATEGORY;
