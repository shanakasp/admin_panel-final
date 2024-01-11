import { Button, Card, CardContent } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import "./styles.css";

function PreviewCategory() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch data from your backend API
    fetch(
      "http://ec2-3-139-78-36.us-east-2.compute.amazonaws.com:8000/category/getAllCategories"
    )
      .then((response) => response.json())
      .then((data) => setCategories(data.result.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header setSearch={setSearch} />

      <div className="categoryContainer">
        {filteredCategories.map((category, index) => (
          <Link
            key={category.category_id}
            to={`/form/${category.category_id}`}
            className={`card cardHover`}
          >
            <Card>
              <CardContent>
                <img
                  src={category.image_url}
                  alt={category.category_name}
                  className="categoryImage"
                />
                <Button
                  variant="contained"
                  color="primary"
                  className="categoryName"
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#2196f3")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#3f51b5")
                  }
                >
                  {category.category_name}
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PreviewCategory;
