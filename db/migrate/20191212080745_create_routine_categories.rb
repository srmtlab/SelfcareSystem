class CreateRoutineCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :routine_categories do |t|
      t.references :routine,  foreign_key: true
      t.references :category,  foreign_key: true

      t.timestamps
    end
    
    add_index :routine_categories, [:routine_id, :category_id], unique: true
  end
end
