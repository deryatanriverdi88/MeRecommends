

# USERS

derya = User.create(name: "Derya", username: "deryat")
kevin = User.create(name: "Kevin", username: "molduene")

# LOCATIONS

brooklyn = Location.create(name: "Brooklyn", state: "New York")
manhattan = Location.create(name: "Manhattan", state: "New York")
queens = Location.create(name: "Queens", state: "New York")
white_plains = Location.create(name: "White Plains", state: "New York")
rye = Location.create(name: "Rye", state: "New York")
yonkers = Location.create(name: "Yonkers", state: "New York")
long_beach = Location.create(name: "Long Beach", state: "New York")


# RECOMMENDATIONS

amber_steakhouse = Recommendation.create(user: derya, location: brooklyn, type_of: "Restaurant", description: "It is very good!", price_range: "$$$", rate: 5, place: "Amber Steakhouse")

jojo_restaurant = Recommendation.create(user: kevin, location: manhattan, type_of: "Restaurant", description: "It is very pricey!", price_range: "$$$$", rate: 2, place: "Jojo Restaurant")

#LIKES

like_1 = Like.create(recommendation: amber_steakhouse)

puts "It is seeded 🍇"
