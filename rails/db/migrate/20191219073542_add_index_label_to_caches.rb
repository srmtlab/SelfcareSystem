class AddIndexLabelToCaches < ActiveRecord::Migration[5.2]
  def change
    add_index :caches, :label, unique: true
  end
end
