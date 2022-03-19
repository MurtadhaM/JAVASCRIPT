

file = open('input.txt', 'r').read().split(',')
        
        

positions = []


for i in range(len(file)):
    print(file[i] + file[i + 1])
    positions.append(i)
    
    