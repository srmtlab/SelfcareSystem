class Cache < ApplicationRecord
    has_many :routines, dependent: :nullify
end
