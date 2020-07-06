class Routine < ApplicationRecord
    belongs_to :user
    belongs_to :cache
    has_many :routine_categories
    has_many :categories, through: :routine_categories

    enum publish: { prohibition: 0, permission: 1 }
end
