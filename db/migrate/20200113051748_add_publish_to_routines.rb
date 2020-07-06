class AddPublishToRoutines < ActiveRecord::Migration[5.2]
  def change
    add_column :routines, :publish, :integer, :default => 1
  end
end
