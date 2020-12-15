function formatSeconds(totalSeconds) {
    
        let hours   = Math.floor(totalSeconds / 3600)
        let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60)
        let seconds = totalSeconds - (hours * 3600) - (minutes * 60)
      
        seconds = Math.round(seconds * 100) / 100
      
        let result = (hours < 10 ? "0" + hours : hours)
            result += "-" + (minutes < 10 ? "0" + minutes : minutes)
            result += "-" + (seconds  < 10 ? "0" + seconds : seconds)
        return result.toString().substr(2)
}

exports.run = (client, message, args) => {

    let d = new Date()
    let now = Math.round(d.getTime() / 1000)

    let workAmount = Math.floor(Math.random() * (200 + 1 - 50) + 50)

    client.db.get('SELECT work FROM users WHERE id=?', [message.author.id], (err, row) => {
        if(err) console.error(err)
        else if(row == undefined) {
            return message.channel.send('Try again, I just added you to my system!'.embedify())
        } else {
            if(now - row.work < 7200) {
                return message.channel.send(`You are not allowed to work again right now! Try again in \`${formatSeconds(row.work - now).replace(/\-/, 'h').replace(/\-/, 'm')}s.\``.embedify())
            } else {
                client.db.run('UPDATE users SET treats=treats+?, work=? WHERE id=?', [workAmount, now, message.author.id], (err) => {
                    if(err) console.error(err)
                    else {
                        return message.channel.send(`You earned ${workAmount} treats off of this article!`.embedify().setTitle(randomHeadline()))
                    }
                })
            }
        }
    })
}

exports.help = {
    enabled: true,
    hideHelp: false,
    type: "economy",
    name: "work",
    aliases: ['write', 'journalism', 'job'],
    description: "The `work` command allows you to work for some treats!",
    usage: "work"
}

const randomHeadline = () => {
    let age = ["Young", "Teenage", "Old", "Over-the-Hill"],
    randomAge = age[Math.round(Math.random() * (age.length - 1))],
    amount = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "99"],
    randomAmount = amount[Math.round(Math.random() * (amount.length - 1))],
    answer = ["Decides", "Doesn't Have a Clue", "Finds Out", "Goes Undercover", "Is Undecided", "Knows the Answer", "Sleeps Her Way to the Answer", "Uncovers the Truth"],
    randomAnswer = answer[Math.round(Math.random() * (answer.length - 1))],
    boughtSold = ["Bought", "Gave Away", "Sold", "Flogged", "Shifted", "Purchased"],
    randomBoughtSold = boughtSold[Math.round(Math.random() * (boughtSold.length - 1))],
    changing = ["Blowing Up", "Building", "Dead", "Defunct", "Developing", "Done For", "Dying", "Enduring", "Flourishing", "Gaining Credibility", "Gathering Momentum", "Growing", "Killing it", "Lacking Credibility", "Mushrooming", "No More", "Surviving", "Taking Over"],
    randomChanging = changing[Math.round(Math.random() * (changing.length - 1))],
    coolest = ["Coolest", "Most Contemporary", "Edgiest", "Hippest"],
    randomCoolest = coolest[Math.round(Math.random() * (coolest.length - 1))],
    drugTaking1 = ["Anal Funnelling", "Bombing", "Dabbing", "Gumming", "Hoofing", "Ingesting", "Injecting", "Mainlining"],
    randomDrugTaking1 = drugTaking1[Math.round(Math.random() * (drugTaking1.length - 1))],
    drugTaking2 = ["Racking up", "Shelving", "Smoking", "Sniffing", "Snorting", "Space Blasting", "Speedballing", "Swallowing", "Taking"],
    randomDrugTaking2 = drugTaking2[Math.round(Math.random() * (drugTaking2.length - 1))],
    drugTaking = drugTaking1.concat(drugTaking2),
    randomDrugTaking = drugTaking[Math.round(Math.random() * (drugTaking.length - 1))],
    drug1 = ["2C-B", "Acid", "Amphetamines", "Angel Dust", "Base", "Basuco", "Birdie Powder", "Blowcaine", "Butane", "Crack Cocaine", "Crystal Meth", "Ecstasy", "Fentanyl", "Freebase", "GHB"],
    randomDrug1 = drug1[Math.round(Math.random() * (drug1.length - 1))],
    drug2 = ["Glue", "Gutter Glitter", "Heroin", "Ketamine", "Krokodil", "LSD", "Magic Mushrooms", "Mescalin", "Mephedrone", "Methamphetamine", "MCAT", "MDMA", "Narcotics", "Nose Candy", "PCP", "Rohypnol", "Scopolamine", "Shrooms", "Weasel Dust", "Weed", "Xanax"],
    randomDrug2 = drug2[Math.round(Math.random() * (drug2.length - 1))],
    drug = drug1.concat(drug2),
    randomDrug = drug[Math.round(Math.random() * (drug.length - 1))],
    fake = ["Bogus", "Bullshit", "Fake", "Phony", "Counterfeit", "Moody", "Dodgy"],
    randomFake = fake[Math.round(Math.random() * (fake.length - 1))],
    familyMember = ["Brother", "Brother-in-Law", "Chef", "Cleaner", "Cousin", "Dad", "Gay Best Friend", "Grandfather", "Gym Buddy", "Male Stripper", "Neighbour", "Pet Dog", "Postman", "Step Brother", "Uncle"],
    randomFamilyMember = familyMember[Math.round(Math.random() * (familyMember.length - 1))],
    festival = ["Burning Man", "Boomfest", "Coachella", "Creamfields", "Donauinselfest", "Field Day", "Glastonbury", "Global Gathering", "Lovebox", "Mawazine", "Parklife", "Przystanek Woodstock", "Rock in Rio", "Sonar", "SXSW", "Sundance", "Warehouse Project"],
    randomFestival = festival[Math.round(Math.random() * (festival.length - 1))],
    genre = ["Ambient-Pop", "Baile Funk", "Breakcore", "Britstep", "Bro-Step", "Chillwave", "Clownstep", "Cumbia", "Doghouse", "Danger Music", "Drillstep", "Nu-Disco", "No-Wave", "Niche", "Crunkstep", "DnB-Core", "Dubstep", "Post-EDM", "Pre-IDM", "Farmcore", "Folk-Tronica", "Hardcore Barbershop-Tronica", "Hymntronica", "Post-Punk", "Post-Trap", "Psytrance", "Rape-Gaze", "Sadcore", "Seapunk", "Scouse House", "Shitcore", "Soft Grunge", "Sprock", "Tumblrcore", "Witchhouse"],
    randomGenre = genre[Math.round(Math.random() * (genre.length - 1))],
    gigged = ["Appeared as a Hologram at", "Beatboxed at", "Freestyled at", "Gigged at", "Headlined", "Rejected", "Played"],
    randomGigged = gigged[Math.round(Math.random() * (gigged.length - 1))],
    guide = ["Explorations in", "Guide to", "Tour of", "Travels in", "Trip Around"],
    randomGuide = guide[Math.round(Math.random() * (guide.length - 1))],
    group = ["Cartel", "Crew", "Faction", "Gang", "Group", "Subculture", "Tribe"],
    randomGroup = group[Math.round(Math.random() * (group.length - 1))],
    gang = ['"The Bloods"', '"The Crips"', '"The Mungiki"', '"The Russian Mob"', '"Los Zetas"', '"The 18th Street Gang"', '"The Mongols"', '"The Triads"', '"The Texas Syndicate"', '"The IRA"', '"The Cosa Nostra"', '"The Hell’s Angels"', '"The Yakuza"', '"The Black Guerrilla Family"', '"Wah Ching"', '"The Aryan Brotherhood"', '"The Jamaican Posse"', '"The Burger Bar Boys"', '"The Croxteth Crew"', '"The Peckham Boys"', '"The Tijuana Cartel"'],
    randomGang = gang[Math.round(Math.random() * (gang.length - 1))],
    we = ["I", "We"],
    randomWe = we[Math.round(Math.random() * (we.length - 1))],
    musicScene = ["Scene"],
    randomMusicScene = musicScene[Math.round(Math.random() * (musicScene.length - 1))],
    nationality = ["Bolivian", "Bosnian", "British", "Brazilian", "Bulgarian", "Burmese", "Cambodian", "Canadian", "Chechnyan", "Chilean", "Chinese", "Costa Rican", "Crimean", "Cuban", "Ghanain", "Guatemalan", "Hungarian", "Japanese", "Jordanian", "Lebanese", "Liberian", "Lithuanian", "Macedonian", "Mexican", "Moldovan", "Mongolian", "Moscovite", "Nicaraguan", "North Korean", "Palestinian", "Pakistani", "Persian", "Peruvian", "Philipino", "Polynesian", "Romanian", "Russian", "Serbian", "Scandinavian", "Somali", "South African", "Sri Lankan", "Syrian", "Venezuelan", "Vietnamese", "Zambian", "Zimbabwean"],
    randomNationality = nationality[Math.round(Math.random() * (nationality.length - 1))],
    object1 = ["Bazooka", "Beer Can", "Beard Trimmer", "Baseball Bat", "Burka", "Blood Clot", "Broken Bottle", "Condom", "Drill", "Drum Kit", "Fixie", "Glow Stick", "Helmet", "Horoscope", "Kalashnikov", "Keyboard", "MacBook", "Lego Brick"],
    randomObject1 = object1[Math.round(Math.random() * (object1.length - 1))],
    object2 = ["Light Sabre", "Lighter", "Machete", "Nailgun", "Neon Light", "Needle", "Plaster", "Plastic Fork", "Riot Shield", "Rifle", "Rocket Launcher", "Rubber Duck", "Samurai Sword", "Synthesizer", "Tampon", "Thong", "TV Remote"],
    randomObject2 = object2[Math.round(Math.random() * (object2.length - 1))],
    object = object1.concat(object2),
    randomObject = object[Math.round(Math.random() * (object.length - 1))],
    occupation1 = ["Barista", "Bouncer", "Black Lives Matter Activist", "Bull Rider", "Burger Flipper", "Butcher", "Child Porn Fanatic", "Creative", "Death Row Inmate", "Deep Sea Diver", "Donkey Fluffer", "Drug Addict", "Drug Baron", "Farmer", "Film Maker", "Fishmonger", "Garbage Collector", "Graffiti Crew Member", "Hacker", "Hooker", "Hipster", "Human Trafficker", "Janitor", "Jimmy Savile Impersonator", "Lumberjack"],
    randomOccupation1 = occupation1[Math.round(Math.random() * (occupation1.length - 1))],
    occupation2 = ["Media Runner", "Midget Stripper", "Mime Artist", "Miner", "Neo-Nazi", "Necrophiliac", "Painter", "Paramedic", "Paleontologist", "Pig Farmer", "Pilot", "Pirate", "Plumber", "Priest", "PR Exec", "Programmer", "Psychologist", "Prostitute", "Rapper", "Rocket Scientist", "Roofer", "Scatologist", "Serial Killer", "Sex Offender", "Sex Slave", "Sex Worker", "Snake Milker", "Socialite", "Supermodel", "Steel Worker", "Taxi Driver", "Truck Driver", "Uni Student", "Web Designer"],
    randomOccupation2 = occupation2[Math.round(Math.random() * (occupation2.length - 1))],
    occupation = occupation1.concat(occupation2),
    randomOccupation = occupation[Math.round(Math.random() * (occupation.length - 1))],
    person1 = ["Adolf Hitler", "Adnan Syed", "Angela Merkel", "Arnold Schwarzenegger", "Barack Obama", "Ben Affleck", "Beyonce", "Bill Clinton", "Boris Johnson", "Britney Spears", "Brian Blessed", "Calvin Harris", "Cara Delevingne", "Chairman Mao", "Charles Taylor", "Che Guevara", "Colonel Qaddafi", "Condoleezza Rice", "Courtney Love", "Chris Brown", "Dr. Dre", "Daniel Radcliffe", "David Bowie", "David Letterman", "Dick Cheney", "Donald Trump", "Donald Trump", "Trump", "Trump", "Ivanka Trump", "Drew Barrymore", "Edward Snowden", "Fidel Castro", "Gary Glitter", "George Bush", "Harry Styles", "Hilary Clinton", "Hugo Chavez", "James Franco", "Jay-Z", "Jim Carrey", "John Belushi", "Jeremy Corbyn", "Jeremy Corbyn", "John Lennon", "Julian Assange", "Justin Bieber", "Kanye West"],
    randomPerson1 = person1[Math.round(Math.random() * (person1.length - 1))],
    person2 = ["Kanye West", "Kelsey Grammar", "Kim Dotcom", "Kim Jong Un", "Lil Wayne", "Lily Allen", "Lindsay Lohan", "Marilyn Monroe", "Martin Shkreli", "Matthew McConaughey", "Method Man", "Michael Barrymore", "Michael Jackson", "Miley Cyrus", "Mike Tyson", "Milo Yiannopoulos", "Morgan Freeman", "Mussolini", "Nigel Farage", "Nigella Lawson", "Notorious B.I.G.", "Paris Hilton", "Paul McCartney", "Phil Collins", "Puff Daddy", "R. Kelly", "Ricky Gervais", "Richard Dawkins", "Rihanna", "Robert Downey Jr.", "Robert Mugabe", "Rolf Harris", "Ryan Gosling", "Saddam Hussein", "Satan", "Seth Rogen", "William Shakespeare", "Snoop Dogg", "Stanley Kubrick", "Stalin", "Steve Bannon", "Stormzy", "Tupac", "Theresa May", "Theresa May", "Vladimir Putin", "Putin", "Winston Churchill"],
    randomPerson2 = person2[Math.round(Math.random() * (person2.length - 1))],
    person = person1.concat(person2),
    randomPerson = person[Math.round(Math.random() * (person.length - 1))],
    place1 = ["Acapulco", "Baltimore", "Bangkok", "Beirut", "Belgrade", "Berlin", "Bogota", "Borneo", "Brooklyn", "Cali", "Cambodia", "Cape Town", "Caracas", "Cartagena", "Chicago", "Chile", "Croydon", "Cuba", "Denmark", "Detroit", "Durban", "District 9", "Egypt", "Gaza", "Guadalahara", "Guatemala", "Hackney", "Hanoi", "Helsinki", "Iran", "Iraq", "Jerusalem", "Johannesburg", "Juarez"],
    randomPlace1 = place1[Math.round(Math.random() * (place1.length - 1))],
    place2 = ["Kiev", "Kingston", "Lebanon", "Leipzig", "London", "Los Cabos", "Manchester", "Medellin", "Montenegro", "Moscow", "New Orleans", "NY", "North Korea", "Osaka", "Pakistan", "Penang", "Pyongyang", "Russia", "Santiago", "San Salvador", "Seoul", "Serbia", "Shoreditch", "Soho", "Sudan", "Syria", "Timbuktu", "Tijuana", "Zagreb", "Zurich", "Houston", "Ukraine", "Congo", "Sao Paolo", "San Francisco", "Silicon Valley", "St. Louis", "Williamsburg"],
    randomPlace2 = place2[Math.round(Math.random() * (place2.length - 1))],
    place = place1.concat(place2),
    randomPlace = place[Math.round(Math.random() * (place.length - 1))],
    sexualOrientation = ["Gay", "Homosexual", "Lesbian", "Feminist", "Queer"],
    randomSexualOrientation = sexualOrientation[Math.round(Math.random() * (sexualOrientation.length - 1))],
    scenario = ["At College", "At Work", "Conducting Sacrifices", "In a Coma", "In Bed", "In Rehab", "In School", "At a Sex Party", "In the Studio", "On Location", "On the Streets", "On Vacation", "Playing Poker", "Playing Russian Roulette", "Undercover", "Underground"],
    randomScenario = scenario[Math.round(Math.random() * (scenario.length - 1))],
    statuses = ["Bi-Curious", "Bicurious", "Bigender", "Bisexual", "Cisgender", "Closeted", "Demiromantic", "Demisexual", "Down Syndrome", "Feminine-Presenting", "Gender Fluid", "Gender Non-Conforming", "Gender Normative", "Genderqueer", "Gynesexual", "Hermaphrodite", "Heterosexual", "Homosexual", "Lesbian", "Lipstick Lesbian", "Masculine-Presenting", "Metrosexual", "Non-Binary", "Pansexual", "Paraplegic", "Polyamorous", "Queer", "Skoliosexual", "Thalidomide", "Trans", "Transgender"],
    randomStatus = statuses[Math.round(Math.random() * (statuses.length - 1))],
    swapping = ["Exchanging", "Substituting", "Swapping", "Switching", "Trading"],
    randomSwapping = swapping[Math.round(Math.random() * (swapping.length - 1))],
    time = ["24 Hours", "48 Hours", "5 Minutes", "72 Hours", "A Fucking Eternity", "A Month", "A Week", "A Year", "A Decade", "Channukah", "Christmas", "Easter", "Eid", "Halloween", "January", "Passover", "Fucking Ages", "Way Too Long"],
    randomTime = time[Math.round(Math.random() * (time.length - 1))],
    tvShow = ['"Archer"', '"Arrested Development"', '"Avatar"', '"Batman"', '"Breaking Bad"', '"Black Panther"', '"Catfish"', '"CSI"', '"Dexter"', '"Doctor Who"', '"Fawlty Towers"', '"Friends"', '"Game of Thrones"', '"Harry Potter"', '"House of Cards"', '"Lost"', '"Mad Men"', '"M.A.S.H."', '"Seinfeld"', '"Silicon Valley"', '"Star Trek"', '"Star Wars"', '"Stranger Things"', '"The Killing"', '"The Sopranos"', '"The Room"', '"The Tonight Show"', '"The X-Files"', '"The Wire"', '"Top Gear"', '"True Detective"', '"Twin Peaks"', '"T.O.W.I.E."'],
    randomTvShow = tvShow[Math.round(Math.random() * (tvShow.length - 1))],
    pain = ["Killed", "Tortured", "Molested", "Executed", "Strangled", "Murdered", "Whored Out", "Violated", "Defiled", "Abused", "Assaulted"],
    randomPain = pain[Math.round(Math.random() * (pain.length - 1))],
    religion = ["Christian", "Hindu", "Jewish", "Muslim", "Scientologist", "Buddhist", "Taoist", "Sikh", "Pagan", "Kemetist"],
    randomReligion = religion[Math.round(Math.random() * (religion.length - 1))],
    socialMediaAction = ["Posted it on Facebook", "Live Tweeted the Whole Thing", "Instagrammed the Shit Out of it", "Built an App for it", "Made a Hilarious Vine of it", "Started an AMA on Reddit", "Created an Account for it on Tinder", "Sent Out a Bunch of Snapchats", "Slapped it on Youtube"],
    randomSocialMediaAction = socialMediaAction[Math.round(Math.random() * (socialMediaAction.length - 1))],
    socialNetwork = ["Buzzfeed", "Facebook", "Twitter", "Instagram", "Grindr", "Vine", "Reddit", "Tinder", "Bumble", "Happn", "Snapchat", "MySpace", "AirBnB"],
    randomSocialNetwork = socialNetwork[Math.round(Math.random() * (socialNetwork.length - 1))],
    doingBad = ["Fellating", "Having Sex with", "Kissing"],
    randomDoingBad = doingBad[Math.round(Math.random() * (doingBad.length - 1))],
    documented = ["Caught", "Documented", "Filmed"],
    randomDocumented = documented[Math.round(Math.random() * (documented.length - 1))],
    found = ["Acquired", "Found", "Got Hold Of", "Stumbled Upon"],
    randomFound = found[Math.round(Math.random() * (found.length - 1))],
    worst = ["Most Backward Place We've Ever Been", "Seediest Place in the World", "Most Dangerous Place on Earth"],
    randomWorst = worst[Math.round(Math.random() * (worst.length - 1))],
    howWhy = ["How", "Why"],
    randomHowWhy = howWhy[Math.round(Math.random() * (howWhy.length - 1))],
    whatHowWhy = ["What", "How", "Why"],
    randomWhatHowWhy = whatHowWhy[Math.round(Math.random() * (whatHowWhy.length - 1))],
    articleType = ["An Exposé", "A Betrayal", "A Confession", "The Definitive Guide", "A Documentary", "We Go Deep Undercover"],
    randomArticleType = articleType[Math.round(Math.random() * (articleType.length - 1))],
    articleTyped = ["An Exposé on", "A Betrayal of", "A Confession from", "The Definitive Guide to", "A Documentary on", "We Go Deep Undercover with"],
    randomArticleTyped = articleTyped[Math.round(Math.random() * (articleTyped.length - 1))],
    front = ["Just a Front for", "Full of", "Packed with", "A Facade For"],
    randomFront = front[Math.round(Math.random() * (front.length - 1))],
    band = ["Band"],
    randomBand = band[Math.round(Math.random() * (band.length - 1))],
    lived = ["Lived as", "Began Life as", "Masqueraded as", "Pretended to be"],
    randomLived = lived[Math.round(Math.random() * (lived.length - 1))],
    reason = ["For No Reason At All", "For Shits and Giggles", "For A laugh", "As a Wind Up", "For Fun", "Because That's Journalism", "To Write This Article", "As a Joke"],
    randomReason = reason[Math.round(Math.random() * (reason.length - 1))],
    save = ["Save", "Stop", "Prevent"],
    randomSave = save[Math.round(Math.random() * (save.length - 1))],
    debating = ["Debating", "Deliberating", "Considering"],
    randomDebating = debating[Math.round(Math.random() * (debating.length - 1))],
    discover = ["Discover", "Find Out", "See"],
    randomDiscover = discover[Math.round(Math.random() * (discover.length - 1))],
    went = ["Went To", "Flew To", "Travelled To", "Hitchhiked To"],
    randomWent = went[Math.round(Math.random() * (went.length - 1))],
    happened = ["Happened", "Went On", "Went Down"],
    randomHappened = happened[Math.round(Math.random() * (happened.length - 1))],
    human = ["Man", "Woman", "Child", "Teenager", "Girl", "Boy", "Baby"],
    randomHuman = human[Math.round(Math.random() * (human.length - 1))],
    met = ["Met", "Stumbled Across", "Found", "Ignored"],
    randomMet = met[Math.round(Math.random() * (met.length - 1))],
    member = ["A Member", "A Representative", "A Foe", "An Enemy", "A Whistleblower"],
    randomMember = member[Math.round(Math.random() * (member.length - 1))],
    political = ["Alt-Right", "Communist", "Conservative", "Democrat", "Fake News", "Liberal", "Socialist"],
    randomPolitical = political[Math.round(Math.random() * (political.length - 1))],
    becoming = ["Has Become", "Is Becoming", "Is Unlikely to Be", "Should Never Be", "Should Never Become", "Will Never Be", "Will Never Become"],
    randomBecoming = becoming[Math.round(Math.random() * (becoming.length - 1))],
    isnt = ["Is", "Isn't"],
    randomIsnt = isnt[Math.round(Math.random() * (isnt.length - 1))],
    popular = ["More Popular", "Less Popular", "More Hated", "Better Known"],
    randomPopular = popular[Math.round(Math.random() * (popular.length - 1))],
    advocate = ["Advocate", "Aficionado", "Chief", "Devotee", "Enthusiast", "Fan", "Hater", "Honcho", "Leader", "Parasite"],
    randomAdvocate = advocate[Math.round(Math.random() * (advocate.length - 1))],
    addicted = ["Addicted to", "Attached to", "Dependent on", "Fanatical About", "Hooked on", "Hyped About", "Obsessed with", "Wedded to"],
    randomAddicted = addicted[Math.round(Math.random() * (addicted.length - 1))],
    capital = ["Capital", "Ghetto", "Slum", "Town"],
    randomCapital = capital[Math.round(Math.random() * (capital.length - 1))],
    has = ["Has", "Gained"],
    randomHas = has[Math.round(Math.random() * (has.length - 1))],
    movie = ["Film", "Movie", "TV Show"],
    randomMovie = movie[Math.round(Math.random() * (movie.length - 1))],
    everyone = ["Everyone is", "People are", "The Internet is", "Twitter is", "4Chan is", "Imgur is", "Reddit is"],
    randomEveryone = everyone[Math.round(Math.random() * (everyone.length - 1))],
    men = ["Men", "Women", "Children", "Transvestites"],
    randomMen = men[Math.round(Math.random() * (men.length - 1))],
    taught = ["Taught"],
    randomTaught = taught[Math.round(Math.random() * (taught.length - 1))],
    movement = ["#NRA", "#BoycottNRA", "#GunControl", "#Brexit", "#VoteLeave", "#VoteRemain", "#BlackLivesMatter", "#MeToo", "#MAGA", "#TimesUp", "#MuslimBan", "#DACA", "#NoBanNoWall"],
    randomMovement = movement[Math.round(Math.random() * (movement.length - 1))],
    photo = ["Photo", "Blurry Photo", "Haunting Photo", "Inspirational Photo", "Banned Video", "Seedy Video", "Vintage Photo", "Old Movie", "8-Track Recording", "Super 8 Video", "Grainy Video"],
    randomPhoto = photo[Math.round(Math.random() * (photo.length - 1))],
    using = ["Using", "Using", "Embracing", "Utilising"],
    randomUsing = using[Math.round(Math.random() * (using.length - 1))],
    near = ["In", "In", "Near", "Outside"],
    randomNear = near[Math.round(Math.random() * (near.length - 1))],
    portray = ["Show", "Portray", "Illustrate", "Capture"],
    randomPortray = portray[Math.round(Math.random() * (portray.length - 1))],
    prove = ["Prove", "Show", "Demonstrate", "Confirm", "Disprove"],
    randomProve = prove[Math.round(Math.random() * (prove.length - 1))],
    angst = ["Angst", "Apathy", "Anger", "Agony", "Seediness", "Calmness", "Exasperation", "Happiness", "Strangeness", "Tranquility"],
    randomAngst = angst[Math.round(Math.random() * (angst.length - 1))],
    largest = ["Largest", "Biggest", "Most Significant"],
    randomLargest = largest[Math.round(Math.random() * (largest.length - 1))],
    bust = ["Bust", "Haul", "Find"],
    randomBust = bust[Math.round(Math.random() * (bust.length - 1))],
    placeFestival = place.concat(festival),
    randomPlaceFestival = placeFestival[Math.round(Math.random() * (placeFestival.length - 1))],
    statusReligion = statuses.concat(religion),
    randomStatusReligion = statusReligion[Math.round(Math.random() * (statusReligion.length - 1))],
    statusReligionNationality = statusReligion.concat(nationality),
    randomStatusReligionNationality = statusReligionNationality[Math.round(Math.random() * (statusReligionNationality.length - 1))],
    occupationBand = occupation.concat(band),
    randomOccupationBand = occupationBand[Math.round(Math.random() * (occupationBand.length - 1))],
    occupationStatusReligionNationality = statusReligionNationality.concat(occupation),
    randomOccupationStatusReligionNationality = occupationStatusReligionNationality[Math.round(Math.random() * (occupationStatusReligionNationality.length - 1))],
    sexualOrientationReligion = sexualOrientation.concat(religion),
    randomSexualOrientationReligion = sexualOrientationReligion[Math.round(Math.random() * (sexualOrientationReligion.length - 1))],
    socialNetworkGangGenreDrug = socialNetwork.concat(socialNetwork, gang, genre, drug),
    randomSocialNetworkGangGenreDrug = socialNetworkGangGenreDrug[Math.round(Math.random() * (socialNetworkGangGenreDrug.length - 1))],
    becomingIsnt = becoming.concat(isnt, isnt, isnt, isnt, isnt),
    randomBecomingIsnt = becomingIsnt[Math.round(Math.random() * (becomingIsnt.length - 1))],
    drugSocialNetworkTVShow = drug.concat(socialNetwork, tvShow),
    randomDrugSocialNetworkTVShow = drugSocialNetworkTVShow[Math.round(Math.random() * (drugSocialNetworkTVShow.length - 1))],
    a = randomHowWhy + " " + randomPlace + "'s " + randomOccupation + "s are " + randomSwapping + " " + randomObject1 + "s for " + randomObject2 + "s",
    b = randomWe + " Spent " + randomTime + " " + randomScenario + " with " + randomPlace + "'s " + randomOccupation + "s",
    c = randomDrugTaking + " " + randomDrug + " " + randomScenario + " with " + randomPerson,
    d = "A " + randomStatusReligionNationality + " " + randomOccupation + "'s " + randomGuide + " " + randomPlace,
    e = randomObject1 + "s, " + randomObject2 + "s and " + randomDrug + ": " + randomScenario + " with " + randomPerson + " in " + randomPlace,
    f = "Is the " + randomNationality + " " + randomGenre + " " + randomMusicScene + " " + randomChanging + "?",
    g = randomTime + " with " + randomPerson + " and a " + randomNationality + " " + randomOccupation,
    h = randomPerson + "'s " + randomFamilyMember + " is Not a " + randomOccupation1 + ", But He is a " + randomOccupation2,
    i = "Do " + randomOccupation + "s Really Need " + randomObject + "s? This " + randomNationality + " " + randomGenre + " Fan " + randomAnswer,
    j = "We're " + randomDebating + " " + randomDrugTaking1 + " " + randomDrug1 + " vs. " + randomDrugTaking2 + " " + randomDrug2 + " with " + randomPerson,
    k = "Meet the " + randomStatusReligionNationality + " " + randomOccupation + "s Who Are Putting " + randomGenre + " Back on the Map",
    l = "I " + randomLived + " a " + randomOccupation + " in " + randomPlace + " and There Was No " + randomPerson,
    m = randomDiscover + " What " + randomHappened + " When We Were " + randomScenario + " for " + randomTime + " in " + randomPlace,
    n = "We're " + randomDrugTaking + " " + randomDrug + " with " + randomPlace + "'s " + randomOccupation + "s",
    o = "Next Month, " + randomPerson + " Spends " + randomTime + " With a " + randomObject + ", " + randomDrugTaking + " " + randomDrug,
    p = "This is the " + randomStatusReligionNationality + " " + randomOccupation + " Who Wants to Make " + randomPlace1 + " the New " + randomPlace2,
    q = randomPerson + ": " + randomHowWhy + " a " + randomObject + " Couldn't " + randomSave + " My " + randomFamilyMember + " From Overdosing on " + randomDrug + " in " + randomPlace,
    r = randomHowWhy + " " + randomPerson1 + " Thought " + randomPerson2 + " was a " + randomStatusReligion + " " + randomOccupationBand,
    s = randomHowWhy + " " + randomPlace + "'s " + randomCoolest + " " + randomBand + " Have Already " + randomGigged + " Next Year's " + randomFestival,
    t = randomDrugTaking + " " + randomDrug + " at " + randomFestival + ": " + randomArticleType,
    u = "Meet the Writers Behind " + randomPlace + "'s Version of " + randomTvShow,
    v = randomHowWhy + " " + randomPlace + "'s Answer to " + randomTvShow + " Is Just " + randomPerson + " on " + randomDrug,
    w = randomAge + " and " + randomSexualOrientation + ": " + randomPlace + "'s " + randomOccupation + "s",
    x = randomAmount + " Reasons Why " + randomPlaceFestival + " is the " + randomWorst,
    y = randomWe + " " + randomPain + " " + randomPerson + " and " + randomSocialMediaAction,
    z = randomWe + " " + randomDocumented + " " + randomPerson + " and a " + randomReligion + " " + randomOccupation + " " + randomDoingBad + " Each Other",
    aa = randomHowWhy + " Being a " + randomNationality + " " + randomSexualOrientationReligion + " Got Me a Role on " + randomTvShow,
    ab = randomHowWhy + " " + randomPlace + "'s Version of " + randomSocialNetwork + " is " + randomFront + " " + randomPain + " " + randomOccupation + "s",
    ac = randomWe + " " + randomWent + " " + randomPlaceFestival + " and " + randomBoughtSold + " " + randomFake + " " + randomDrug + " " + randomReason,
    ad = randomWe + " " + randomDocumented + " a " + randomSexualOrientationReligion + " " + randomOccupationBand + " and Didn't " + randomSave + " Them From " + randomDoingBad + " " + randomPerson,
    ae = randomWe + " " + randomMet + " a " + randomHuman + " on " + randomSocialNetwork + " Who " + randomWent + " " + randomPlaceFestival + " and " + randomPain + " Their " + randomFamilyMember,
    af = "I " + randomLived + " " + randomMember + " of " + randomGang,
    ag = randomHowWhy + " a " + randomOccupationStatusReligionNationality + " " + randomGroup + " are the " + randomCoolest + " " + randomGenre + " " + randomBand + " in " + randomPlace,
    ah = randomHowWhy + " " + randomPolitical + " " + randomAdvocate + " " + randomPerson + " " + randomBecomingIsnt + " " + randomAddicted + " " + randomSocialNetworkGangGenreDrug,
    ai = randomPlace + " " + randomHas + " a New " + randomDrug + " " + randomCapital,
    aj = randomEveryone + " Saying This New " + randomReligion + " " + randomMovie + " is the Next " + randomTvShow,
    ak = randomWhatHowWhy + " Being a " + randomOccupation + " " + randomTaught + " Me About " + randomMen,
    al = randomHowWhy + "  " + randomMovement + " is " + randomUsing + " " + randomObject + "s With " + randomStatusReligion + " " + randomOccupation + "s " + randomNear + " " + randomPlace,
    am = "These " + randomPhoto + "s " + randomPortray + " the " + randomAngst + " of " + randomMen + " " + randomAddicted + " " + randomDrugSocialNetworkTVShow,
    an = "We " + randomFound + " " + randomAmount + " " + randomPhoto + "s That " + randomProve + " " + randomPerson + " is into " + randomStatus + " " + randomMen,
    ao = randomHowWhy + " " + randomPlace + "'s " + randomLargest + " " + randomDrug + " " + randomBust + " Fills This " + randomPolitical + " " + randomMovement + " " + randomHuman + " with " + randomAngst,
    ap = randomArticleTyped + " " + randomAge + " " + randomSexualOrientationReligion + " " + randomMen + " " + randomDrugTaking + " " + randomDrug + " " + randomScenario,
    headlines = []

    return headlines.push(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, al, am, an, ao, ap), headlines[Math.round(Math.random() * (headlines.length - 1))]
  }