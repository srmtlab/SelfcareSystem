class Category < ApplicationRecord
    has_many :routine_categories
    has_many :routines, through: :routine_categories
end
