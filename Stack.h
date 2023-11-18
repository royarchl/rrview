#ifndef STACK
#define STACK

#include "DoublyLinkedList.h"


template <class T>
class Stack : public DoublyLinkedList<T>
{
public:
  std::optional<T> peek() const { return this->at(0); }
  int count() const { return this->size(); }

  void push(T data) { this->addToFront(data); }
  void pop() { this->deleteNode(this->at(0)); }
};

#endif
