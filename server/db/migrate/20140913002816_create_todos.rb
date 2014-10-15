class CreateTodos < ActiveRecord::Migration
  def change
    create_table :todos do |t|
      t.string :title
      t.text :description
      t.belongs_to :user

      t.timestamps
    end
  end
end
