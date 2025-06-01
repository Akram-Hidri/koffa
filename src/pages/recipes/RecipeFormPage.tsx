import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useRecipe, useCreateRecipe, useUpdateRecipe, Recipe, RecipeIngredient } from '@/hooks/useRecipes';
import { ArrowLeft, Plus, X, Save, Trash2, ChefHat, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface NewIngredient {
  name: string;
  quantity: string;
  unit?: string;
  optional?: boolean;
}

const RecipeFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const { data: existingRecipe, isLoading: isLoadingRecipe } = useRecipe(id || '');
  const { mutateAsync: createRecipe, isPending: isCreating } = useCreateRecipe();
  const { mutateAsync: updateRecipe, isPending: isUpdating } = useUpdateRecipe();
  
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<NewIngredient>({ 
    name: '', 
    quantity: '',
    unit: '',
    optional: false
  });
  const [showIngredientDialog, setShowIngredientDialog] = useState(false);

  const form = useForm<Recipe>({
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      cook_time: undefined,
      prep_time: undefined,
      difficulty: 'Medium',
      servings: 4,
      category: '',
      cuisine: '',
      image_url: '',
    },
  });

  // Load existing recipe data when editing
  useEffect(() => {
    if (isEditMode && existingRecipe) {
      form.reset({
        title: existingRecipe.title,
        description: existingRecipe.description || '',
        instructions: existingRecipe.instructions || '',
        cook_time: existingRecipe.cook_time,
        prep_time: existingRecipe.prep_time,
        difficulty: existingRecipe.difficulty || 'Medium',
        servings: existingRecipe.servings || 4,
        category: existingRecipe.category || '',
        cuisine: existingRecipe.cuisine || '',
        image_url: existingRecipe.image_url || '',
      });
      
      setIngredients(existingRecipe.ingredients || []);
    }
  }, [existingRecipe, isEditMode, form]);
  
  const addIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity) {
      toast.error('Please provide both name and quantity for the ingredient');
      return;
    }
    
    const ingredientToAdd: RecipeIngredient = {
      id: crypto.randomUUID(),
      recipe_id: id || '',
      name: newIngredient.name,
      quantity: newIngredient.quantity,
      unit: newIngredient.unit,
      optional: newIngredient.optional
    };
    
    setIngredients([...ingredients, ingredientToAdd]);
    setNewIngredient({ name: '', quantity: '', unit: '', optional: false });
    setShowIngredientDialog(false);
  };
  
  const removeIngredient = (index: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };
  
  const onSubmit = async (data: Recipe) => {
    try {
      if (ingredients.length === 0) {
        toast.error('Please add at least one ingredient to your recipe');
        return;
      }
      
      const recipeData = {
        ...data,
        ingredients
      };
      
      if (isEditMode) {
        await updateRecipe({ ...recipeData, id });
      } else {
        await createRecipe(recipeData);
      }
      
      navigate('/recipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  // Categories and cuisines for dropdown selection
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Drinks'];
  const cuisines = ['Middle Eastern', 'Mediterranean', 'Italian', 'Asian', 'American', 'Indian'];
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  if (isEditMode && isLoadingRecipe) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-koffa-green">Loading recipe...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="p-0 mr-3" 
          onClick={() => navigate('/recipes')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-koffa-green">
          {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
        </h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-koffa-green">Basic Information</CardTitle>
              <CardDescription>Enter the main details about your recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Title*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter recipe title" 
                        {...field} 
                        required 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of your recipe" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a cuisine" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cuisines.map((cuisine) => (
                            <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="URL to recipe image" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-koffa-green">Recipe Details</CardTitle>
              <CardDescription>Add cooking times and difficulty</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="prep_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Prep Time (min)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="cook_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Cook Time (min)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Users className="h-4 w-4" /> Servings
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <ChefHat className="h-4 w-4" /> Difficulty
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-koffa-green">Ingredients</CardTitle>
                <CardDescription>List all ingredients needed for your recipe</CardDescription>
              </div>
              <Dialog open={showIngredientDialog} onOpenChange={setShowIngredientDialog}>
                <DialogTrigger asChild>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="border-koffa-green text-koffa-green hover:bg-koffa-green hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Ingredient</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <FormLabel>Name*</FormLabel>
                      <Input 
                        placeholder="e.g., Flour" 
                        value={newIngredient.name}
                        onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <FormLabel>Quantity*</FormLabel>
                        <Input 
                          placeholder="e.g., 2" 
                          value={newIngredient.quantity}
                          onChange={(e) => setNewIngredient({...newIngredient, quantity: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Unit</FormLabel>
                        <Input 
                          placeholder="e.g., cups" 
                          value={newIngredient.unit || ''}
                          onChange={(e) => setNewIngredient({...newIngredient, unit: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <input 
                        type="checkbox" 
                        id="optional" 
                        checked={newIngredient.optional || false}
                        onChange={(e) => setNewIngredient({...newIngredient, optional: e.target.checked})}
                      />
                      <FormLabel htmlFor="optional" className="cursor-pointer m-0">Optional ingredient</FormLabel>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowIngredientDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        onClick={addIngredient}
                      >
                        Add Ingredient
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {ingredients.length === 0 ? (
                <div className="text-center py-8 bg-koffa-beige-light/30 rounded-md">
                  <p className="text-koffa-green-dark">No ingredients added yet</p>
                  <Button 
                    type="button"
                    variant="link" 
                    className="text-koffa-green mt-2"
                    onClick={() => setShowIngredientDialog(true)}
                  >
                    Add your first ingredient
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-koffa-beige-light/20 rounded-md"
                    >
                      <div>
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="ml-2 text-koffa-green-dark">
                          {ingredient.quantity} {ingredient.unit || ''}
                        </span>
                        {ingredient.optional && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-500 py-0.5 px-1.5 rounded">
                            optional
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-koffa-green">Instructions</CardTitle>
              <CardDescription>How to prepare this recipe</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter step-by-step instructions here..."
                        className="min-h-32 resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => navigate('/recipes')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-koffa-green hover:bg-koffa-green-dark text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {isCreating || isUpdating ? 'Saving...' : 'Save Recipe'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RecipeFormPage;
