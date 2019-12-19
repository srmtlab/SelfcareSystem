class AddCacheIdToRoutines < ActiveRecord::Migration[5.2]
  def change
    add_reference :routines, :cache, foreign_key: true
  end
end
