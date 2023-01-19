import Ingredient from './ingredient.interface';
export default interface Product {
  id: number
  name: string,
  venue_id: number
  add_pct: boolean,
  margin: number,
  live: boolean,
  cost: number,
  gross: number,
  gross_profit: number,
  preparation_method: string,
  glass_to_use: string,
  garnish_description: string,
  ml: number,
  ingredients: Ingredient[];
}

