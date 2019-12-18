class Routine < ApplicationRecord
    belongs_to :user
    has_many :routine_categories
    has_many :categories, through: :routine_categories
end
