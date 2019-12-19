class CreateCaches < ActiveRecord::Migration[5.2]
  def change
    create_table :caches do |t|
      t.string :label
      t.string :wd_type

      t.timestamps
    end
  end
end
