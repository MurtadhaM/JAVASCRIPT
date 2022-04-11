
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
new_lines = []

with open('input.txt', 'r') as f:
    for line in f:
        lines.append(line.strip())
total = []

def go_up(line_number, index):
    values = []
    if line_number == 0  :
        return ''


    for i in range( (line_number) , 0 , -1 ) :
        values = []
        if line_number == 0 or lines[line_number - i][index] == 9 :
            return ''
    values.append(lines[line_number - i][index])
    return values

def go_down(line_number, index):
    values = []
    if line_number == len(lines) -1:
        return values
    for i in range( (line_number  ) , len(lines)   ) :
        if  '9' in lines[ i  + 1][index] :
            return values

        values.append(lines[i + 1][index])
    print('\n')
    return (values)
def go_left(line_number, index):
    values = []
    for i in range(  index , 0 , -1 ) :

        if  lines[line_number][ i - 1 ] == '9' :
            return values
        values.append(lines[line_number][i -1])
    print('\n')
    return values

def go_right(line_number, index):

    values = []
    print(f'The line number is {line_number} and the index is {index}')
    for i in range( index+1,  len(lines[line_number])    ) :
        if  lines[line_number][  i    ] == '9' :
            print(f'The value is {lines[line_number][ i    ]}')
            return values
        values.append(lines[line_number][ i ])  

    print('\n')

    return values

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
            #print(f'The value is {value}, line is {line} and the result is {result} and the index is {index}')
            new_lines.append({'line': line_number, 'index': index, 'value': value})

            #print(lines)
            value = int(value +1)
            total.append(value)
            # print(f'The total is {result}')
        result = sum(total)
        # print(f'The total is {total}')
        # print(f'The result is {result}')
        return result


def process(line, line_number , total):
    t = []
    for index, value in enumerate(line):
         find_height(value, line_number, index)


         t.append(lines[line_number][index])

#    print(f'The total is {sum(total)}')


    return ( new_lines)


for line_number, line in enumerate(lines):
        r = process(line, line_number, total)
        #new_lines = r
#print(new_lines)

values_up = []
values_down = []
values_left = []
values_right = []

for index in range(len(new_lines)):
        if new_lines[index]['line'] != 0:
            values_up.append(go_up(new_lines[index]['line'], new_lines[index]['index'] ))
        if new_lines[index]['line'] <= len(new_lines):
            values_down.append(go_down(new_lines[index]['line'], new_lines[index]['index'] ))
        if new_lines[index]['index']  != 0:
            values_left.append(go_left(new_lines[index]['line'], new_lines[index]['index'] ))
        if new_lines[index]['index'] !=0:
            values_right.append(go_right(new_lines[index]['line'], new_lines[index]['index'] ))


        new_sum = []
        new_sum.append(values_down)
        new_sum.append(values_left)
        new_sum.append(values_right)
        new_sum.append(values_up)
        print(new_sum)
        total = []
        for sum in new_sum:
            for i in sum:
                if i != '':
                    for j in i:
                        print(j)
                        total.append(j)
        c = 0                
        print('the total is ' ,  [line for line in total if line != ''].__len__())


new_sum = []
new_sum.append(values_down)
new_sum.append(values_left)
new_sum.append(values_right)
new_sum.append(values_up)
print(new_sum)
total = 0
for sum in new_sum:
    for i in sum:
        if i != '':
            for j in i:
                print(j)
                total += int(j)
                
print(total)

print(values_up)
print(values_down)
print(values_left)
print(values_right)