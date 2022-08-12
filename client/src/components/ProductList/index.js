import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useStoreContext } from "../../utils/GlobalState";
import { UPDATE_PRODUCTS } from "../../utils/actions";
import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif";
import { idbPromise } from "../../utils/helpers";
function ProductList({ currentCategory }) {
  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  useEffect(() => {
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  }, [categoryData, loading, dispatch]);
  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
