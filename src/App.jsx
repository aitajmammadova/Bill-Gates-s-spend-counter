import { useState , useEffect} from 'react'
 
import './App.css'

function App() {
  const [budget,setBudget]=useState(100000)
  const [products,setProducts]=useState([])
  const [buy,setBuy]=useState(false)
  const [sell,setSell]=useState(true)
  const [productCount,setProductCount]=useState([])
  const [recipe,setRecipe]=useState([])
  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/`)
      .then((res) => res.json())
      .then((json) => {
      // const initialCount = json.map((product) => ({ id: product.id, count: 0 }));
      // setCount((prevCount) => [...prevCount, ...initialCount]);
      json.map((p)=>{
        setProductCount((count)=>[...count, {id:p.id - 1, count:0, title:p.title}])
       
      })
      setProducts(json)
      });

  }, []);
 
  const selling = (p)=>{
      const updatedProductCount = [...productCount];
      updatedProductCount[p.id-1].count--;
      setProductCount(updatedProductCount);
      setBudget(budget + Math.floor(p.price))
    
    if (productCount[p.id-1].count === 0){
      setBuy(false)
    }
    if (budget < p.price) {
      setSell(false)
      // setBudget(budget - Math.floor(p.price))
    }


    // Recipe
    const existingProductIndex = recipe.findIndex((item) => item.id === p.id)
    if (existingProductIndex !== -1) {
      const updatedRecipe = [...recipe];
      if (updatedRecipe[existingProductIndex].count > 1) {
        updatedRecipe[existingProductIndex].count--;
        updatedRecipe[existingProductIndex].price-=updatedRecipe[existingProductIndex].fixprice
      } else {
        updatedRecipe.splice(existingProductIndex, 1); // Remove item from recipe when count reaches 0
    }  
    setRecipe(updatedRecipe)
     
  }
}

  const buying = (p)=>{
    if (budget >= p.price) {
      const updatedProductCount = [...productCount];
      updatedProductCount[p.id - 1].count++; // Increment count for the purchased product
 
      setProductCount(updatedProductCount);
      setBuy(true)
      setBudget(budget - Math.floor(p.price))
    }
    //Recipe
    const existingProductIndex = recipe.findIndex((item) => item.id === p.id)
    if (existingProductIndex !== -1) {
      const updateRecipe = [...recipe]
      updateRecipe[existingProductIndex].count++
      updateRecipe[existingProductIndex].price = (updateRecipe[existingProductIndex].count) * updateRecipe[existingProductIndex].fixprice
      console.log(updateRecipe[existingProductIndex].fixprice)
      setRecipe(updateRecipe)
    }
    else {
      setRecipe([...recipe, { id: p.id, count: 1, title: p.title, price: Math.floor(p.price), fixprice:Math.floor(p.price) }])
    }

  
 
  }
    
  return (
    <>
     <section className="container">
      <div className="heading">
        <div className="bill-image"></div>
        <h1>Spend Bill Gates' Money</h1>
      </div>

      <div className="money-bar">${budget}</div>

        <div className="products">
          {products.map(p => (

            <div className="product" key={p.id}>
              <div className="prd-img"><img src={p.image}></img></div>
              <div className="title">{`${p.title.slice(0,10)}...`}</div>
              <div className="price">${Math.floor(p.price)}</div>
              <div className="amount">
                <button className="sell" disabled={productCount[p.id-1]?.count === 0 } onClick={()=>selling(p)}>Sell</button>
                <input className='count' type="text" name="count" id="count" 
                value={productCount[p.id-1]?.count || 0}  readOnly/>
                <button className="buy" onClick={()=>buying(p)} disabled={!sell}>Buy</button>
              </div>


            </div>
          ))}
        </div>

        <div className="recipe">
        {recipe.length>0 ?(
          <div className='recipe-title'>
            <div  className='base-recipe'>
                <h1>Your Reciept</h1>

                {recipe.map(r => (
                  <div key={r.id} >
                    <p> {r.title.slice(0, 10)}...</p>
                    <p> x{r.count}</p> 
                    <p className='recipe-green'>${r.price}</p>
                  </div>
            
                ))}
                
          
            </div>
              
              
          </div>
          
        ):<h1>No data</h1> }
        </div>
     </section>

     

     
    </>
  )
}

export default App
