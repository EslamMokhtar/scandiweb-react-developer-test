const GET_PRODUCTS = {
  query: ` 
    {
      categories {
        name
        products {
          id
          name
          gallery
          inStock
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

const GET_PRODUCT = (pid) => {
  const GET_PRODUCT = {
    query: `
        {
          product(id: "${pid}") {
            id
            name
            inStock
            gallery
            description
            category
            brand
            prices{
              currency{
                label
                symbol
              }
              amount
            }
            attributes {
              id
              name
              type
              items {
                id
                displayValue
                value
              }
            }
          }
        }
      
        `,
  };

  return GET_PRODUCT;
};

export { GET_PRODUCT, GET_PRODUCTS };
