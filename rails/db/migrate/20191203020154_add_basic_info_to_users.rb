class AddBasicInfoToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :name, :string, :default => ''
    add_column :users, :age, :integer, :default => 0
    add_column :users, :gender, :integer, :default => 0
    add_column :users, :reminder_at, :time
  end
end
