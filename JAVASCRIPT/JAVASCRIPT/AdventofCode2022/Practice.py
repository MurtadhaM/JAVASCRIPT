import time, sys

# Display the program's instructions.
print('Press ENTER to begin. Afterward, press ENTER to "click" the stopwatch.')
input()                    # press Enter to begin
print('Started.')
startTime = time.time()
import os
print(os.system('time '))
lastTime = startTime
lapNum = 1



print(f'time elapsed: {time.time() - startTime}')