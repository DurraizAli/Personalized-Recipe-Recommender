import React, { Component } from 'react';
import "./form.css";
import Button from "../button/Button";

export default class RecipeRecommendation extends Component {
  constructor(props) {
    super(props);
    // Create a ref for the slider
    this.sliderRef = React.createRef();
  }

  state = {
    ingredients: [],
    maxCalories: 500,
    servings: 1, // Default servings is 1
    notes: '',
    errors: {},
    currentIngredient: '',
  };

  componentDidMount() {
    // Add event listener after the component mounts
    const slider = this.sliderRef.current;

    if (slider) {
      slider.addEventListener('input', () => {
        const value = slider.value;
        const max = slider.max;
        const progress = (value / max) * 100;
        slider.style.setProperty('--slider-progress', `${progress}%`);
      });
    }
  }

  componentWillUnmount() {
    // Clean up event listener when the component unmounts
    const slider = this.sliderRef.current;
    if (slider) {
      slider.removeEventListener('input', this.handleSliderInput);
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleIngredientChange = (e) => {
    this.setState({ currentIngredient: e.target.value });
  };

  addIngredient = () => {
    const { currentIngredient, ingredients } = this.state;
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      this.setState({
        ingredients: [...ingredients, currentIngredient.trim()],
        currentIngredient: '',
      });
    }
  };

  removeIngredient = (ingredient) => {
    this.setState({
      ingredients: this.state.ingredients.filter(item => item !== ingredient),
    });
  };

  handleServingsChange = (type) => {
    this.setState((prevState) => ({
      servings: type === 'increment' ? prevState.servings + 1 : Math.max(1, prevState.servings - 1), // Ensure servings don't go below 1
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      alert("Recipe recommendation request submitted successfully!");
      this.setState({
        ingredients: [],
        maxCalories: 500,
        servings: 1,
        notes: '',
        errors: {},
        currentIngredient: '',
      });
    }
  };

  validateForm = () => {
    const errors = {};
    if (this.state.ingredients.length === 0) {
      errors.ingredients = "At least one ingredient is required.";
    }
    if (!this.state.maxCalories) {
      errors.maxCalories = "Maximum calories are required.";
    } else if (isNaN(this.state.maxCalories)) {
      errors.maxCalories = "Maximum calories must be a number.";
    }
    return errors;
  };

  render() {
    const { ingredients, maxCalories, servings, notes, errors, currentIngredient } = this.state;

    return (
      <section className="recipe-recommendation">
        <div className="recipe-content">
          <h2 className="recipe-title">Get Personalized Recipe Recommendations</h2>
          <p className="recipe-description">
            Tell us what ingredients you have, and we'll suggest delicious recipes tailored to your preferences.
          </p>

          <div className="recipe-form">
            {/* Ingredients Input Section */}
            <div className="form-group">
              <label className="form-label">Ingredients</label>
              <div className="ingredients-input">
                <input
                  type="text"
                  name="currentIngredient"
                  value={currentIngredient}
                  onChange={this.handleIngredientChange}
                  placeholder="Enter an ingredient (e.g., chicken, tomatoes)"
                  className="ingredient-field"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={this.addIngredient}
                >
                  Add
                </Button>
              </div>
              <div className="ingredients-tags">
                {ingredients.map((ingredient, index) => (
                  <span key={index} className="ingredient-tag">
                    {ingredient}
                    <button type="button" onClick={() => this.removeIngredient(ingredient)}>×</button>
                  </span>
                ))}
              </div>
              {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
            </div>

            {/* Maximum Calories Slider Section */}
            <div className="form-group">
              <label className="form-label">Maximum Calories</label>
              <div className="calories-slider-container">
                <input
                  ref={this.sliderRef}  // Attach the ref here
                  type="range"
                  name="maxCalories"
                  min="100"
                  max="2000"
                  value={maxCalories}
                  onChange={this.handleChange}
                  className="calories-slider"
                />
                <span className="calories-value">{maxCalories} kcal</span>
              </div>
              {errors.maxCalories && <span className="error-message">{errors.maxCalories}</span>}
            </div>

            {/* Servings Control Section */}
            <div className="form-group flex items-center space-x-4">
              <label className="form-label">Number of Servings</label>
              <div className="servings-controls flex items-center space-x-2">
                <Button
                  type="button"
                  onClick={() => this.handleServingsChange('decrement')}
                  className="bg-gray-300 text-lg text-center w-8 h-8 rounded-full"
                >
                  -
                </Button>
                <span className="text-lg font-semibold">{servings}</span>
                <Button
                  type="button"
                  onClick={() => this.handleServingsChange('increment')}
                  className="bg-gray-300 text-lg text-center w-8 h-8 rounded-full"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea
                name="notes"
                value={notes}
                onChange={this.handleChange}
                placeholder="Add any notes or preferences (e.g., vegetarian, gluten-free)"
                className="notes-field"
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                onClick={this.handleSubmit}
              >
                Get Recipes
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
