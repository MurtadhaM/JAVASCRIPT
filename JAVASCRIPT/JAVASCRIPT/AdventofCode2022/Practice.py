days = 18
fish = []



class Fish():

    def __init__(self):
        self.school = []
        self.days = days
        self.offsprings = []
    def get_school(self):
        return self.school

    def kids_processing(self, kids):
        for i in kids:
           print(f'kids {i}')            
    def dayCalculate(self, single_fish):

        kids = []

        for i in range(int(single_fish['dob'])):
            if (single_fish['value'] )  == 0:
                #self.school.append({'value' : 8, 'dob' :  (self.days -i )})
                #self.offsprings.append({'value' : 8, 'dob' :  (self.days -i )})
                kids.append({'value' : 8, 'dob' :  (self.days -i )})
                single_fish['value'] = 6
            else:
                single_fish['value'] = single_fish['value'] - 1




        
        self.kids_processing(kids)
        return self.school


    def fish(self, value, age):
            new_fish = {
            "dob" : value,
            "value" : age,
            }
            return new_fish

    def __str__(self):
        return f'Day {self.dob} has {self.age} fish'
    def add(self, age, dob):
        self.age = age
        self.dob = dob
        self.school.append(self.fish(self.dob, self.age))
        self.total = self.school.__len__()

Fish = Fish()
with open('input.txt', 'r') as f:
    for line in f.read().split(','):
        Fish.add(int(line), days)
total = []



def dayCalculate(days):
    new_fish = []
    for day in range(days, 0, -1):

        for i in fish:
            new_fish.append((int(i) - 1))





for f in range(Fish.get_school().__len__()):
    Fish.dayCalculate(Fish.get_school().__getitem__(f))

print(Fish.get_school())



