class CreateRoutines < ActiveRecord::Migration[5.2]
  def change
    create_table :routines do |t|
      t.references :user,  foreign_key: true
      t.string :text, null: false, default: ""
      t.integer :period, default: 0
      t.integer :count, default: 0
      t.float :importance, default: 0.0
      t.float :confidence, default: 0.0
      t.string :wd_label, null: false, default: ""
      t.timestamps
    end
  end
end
