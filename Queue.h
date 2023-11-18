#ifndef QUEUE
#define QUEUE

#include "DoublyLinkedList.h"


template <typename T>
class Queue : public DoublyLinkedList<T>
{
public:
  std::optional<T> peek() const { return this->at(0); }

  void enqueue(T data) { this->addToRear(data); }
  void dequeue() { this->deleteNode(this->at(0)); }
  void emptyQueue()
  {
    while (this->size() != 0)
    {
      this->dequeue();
    }
  }
};


template <typename T>
std::ostream& operator<<(std::ostream& os, const std::optional<T>& opt)
{
  if (opt.has_value())
    os << opt.value();
  else
    os << "std::nullopt";

  return os;
}

#endif
