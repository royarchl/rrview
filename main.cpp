#include <iostream>
#include "Queue.h"
#include "Stack.h"

int main()
{
  Queue<int> mQ;

  mQ.enqueue(7);
  mQ.enqueue(2);
  mQ.enqueue(9);
  mQ.enqueue(4);

  std::cout << mQ.peek() << std::endl;
  mQ.dequeue();
  std::cout << mQ.peek() << std::endl;
  mQ.emptyQueue();
  std::cout << mQ.peek() << std::endl;


  Stack<double> mStk;

  mStk.push(2.1);
  mStk.push(3.3);
  mStk.push(7.4);
  mStk.push(4.6);
	
  mStk.pop();
  std::cout << mStk.peek() << std::endl;
  mStk.pop();
  std::cout << mStk.peek() << std::endl;

  
  return 0;
}
