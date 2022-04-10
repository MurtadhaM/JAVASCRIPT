def missing_nos(arr, k): 
    n = len(arr) 
    first = 0
    second = 0
    arr.sort() 
    for i in range(n): 
        if (arr[i]  + 1 == len(arr )   ): 
            first =  (len(arr ) + 1)
        if (i + 1 ==  n      ):
            second =  i
                
    return first, second
print(missing_nos([1, 2, 4, 5, 6, 7, 8, 10], 2))