
#variables 
'''
2199943210
3987894921
9856789892
8767896789
9899965678

'''
lines = []
characters = []
with open('input.txt', 'r') as f:
    for line in f:
        lines.append(line.strip())
total = []

def write(data):
    with open('output.txt', 'w') as fs:
        fs.write(str(data))
        
# defining global variables
def find_height(value, line , index):
        index = int(index)
        if index == 0:
            left_neighbor = 199
        if index >= len(lines[line] ) - 1:
            
            right_neighbor = 199
        else:
          right_neighbor = int(lines[line][index +1])    
                   
        
        left_neighbor = int(lines[line][index -1])
        if line == 0:
            
            top_neighbor = 100
        else:
            top_neighbor = int(lines[line -1][index])    
                
        
        
        if line == len(lines) -1:
            bottom_neighbor = 100
        else:
            bottom_neighbor = int(lines[line+1][index])    
            
        line = int(line )
        value = int(value)
        result = ((value) < left_neighbor and  value < right_neighbor and value < top_neighbor  and value < bottom_neighbor)
        
        
        if result == True:
            print(f'The value is {value}, line is {line} and the result is {result} and the index is {index}')

            
            print(lines)
            value = int(value +1)
            total.append(value)
            # print(f'The total is {result}')
        result = sum(total)    
        # print(f'The total is {total}') 
        # print(f'The result is {result}')
        return result

    
new_lines = []
def process(line, line_number , total):
    t = []
    for index, value in enumerate(line):
         find_height(value, line_number, index) 
         t.append(lines[line_number][index])
            
            # print(f'The total is {total}')
    

    return (t)

        
                  
                     

        
    

    

for line_number, line in enumerate(lines): 
        r = process(line, line_number, total)
        new_lines = r 
print(new_lines)        
        
        
                
