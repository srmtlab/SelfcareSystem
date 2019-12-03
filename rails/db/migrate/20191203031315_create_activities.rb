class CreateActivities < ActiveRecord::Migration[5.2]
  def change
    create_table :activities do |t|
      t.references :schedule,  foreign_key: true
      t.time :start
      t.time :end
      t.string :text, null: false, default: ""

      t.timestamps
    end
  end
end
