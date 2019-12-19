class Routine < ApplicationRecord
    belongs_to :user
    belongs_to :cache
    has_many :routine_categories
    has_many :categories, through: :routine_categories
end
