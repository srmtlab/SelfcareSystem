class RemoveWdLabelFromRoutines < ActiveRecord::Migration[5.2]
  def change
    remove_column :routines, :wd_label, :string
  end
end
