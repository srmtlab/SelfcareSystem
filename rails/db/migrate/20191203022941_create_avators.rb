class CreateAvators < ActiveRecord::Migration[5.2]
  def change
    create_table :avators do |t|
      t.references :user,  foreign_key: true
      t.string :name, null: false, default: ""
      t.string :icon, null: false, default: ""
      t.timestamps
    end
  end
end
