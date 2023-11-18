#ifndef DOUBLYLINKEDLIST
#define DOUBLYLINKEDLIST

#include <iostream>
#include <optional>


template <typename T>
struct Node
{
  T nodeData;
  Node<T> *mpNext;
  Node<T> *mpPrev;
};

template <typename T>
class DoublyLinkedList
{
private:
  Node<T> *mpHead;
  Node<T> *mpTail;

public:
  DoublyLinkedList() : mpHead(nullptr), mpTail(nullptr) {}
  // only necessary if memory is dynamically-allocated
  ~DoublyLinkedList()
  {
    Node<T> *current = this->mpHead;
    Node<T> *next;

    while (current != nullptr)
    {
      next = current->mpNext;
      delete current;
      current = next;
    }
  }

  std::optional<T> at(int index) const;
  T find(T search) const;
  int size() const;

  void addToFront(T data);
  void addToRear(T data);
  void insert(T search, T data);
  void deleteNode(std::optional<T> search);

  friend std::ostream& operator<<(std::ostream& os,
    const std::optional<T>& opt)
  {
    if (opt.has_value())
      os << opt.value();
    else
      os << "std::nullopt";

    return os;
  }
};

template <typename T>
std::optional<T> DoublyLinkedList<T>::at(int index) const
{
  if (this->mpHead == nullptr)  return std::nullopt;

  if (index < 0 || index >= this->size())
  {
    return std::nullopt;
  }

  Node<T> *p = this->mpHead;
  for (int i = 0; i < index; ++i)
  {
    p = p->mpNext;
  }
  return p->nodeData;
}

// returns a pointer to an existing node
template <typename T>
T DoublyLinkedList<T>::find(T search) const
{
  if (this->mpHead == nullptr)  return nullptr;

  Node<T> *p = this->mpHead;
  while (p->mpNext != nullptr)
  {
    if (p->nodeData == search)  return p;
    p = p->mpNext;
  }
  return nullptr;
}

template <typename T>
int DoublyLinkedList<T>::size() const
{
  int count = 0;
  Node<T> *current = this->mpHead;

  while (current != nullptr)
  {
    count++;
    current = current->mpNext;
  }
  return count;
}

template <typename T>
void DoublyLinkedList<T>::addToFront(T data)
{
  if (this->mpHead == nullptr)
  {
    this->addToRear(data);
  }
  else
  {
    Node<T> *tmp = new Node<T>{ data, this->mpHead, nullptr };
    this->mpHead->mpPrev = tmp;
    this->mpHead = tmp;
  }
}

template <typename T>
void DoublyLinkedList<T>::addToRear(T data)
{
  if (this->mpHead == nullptr)
  {
    Node<T> *tmp = new Node<T>{ data, nullptr, nullptr };
    this->mpHead = this->mpTail = tmp;
  }
  else
  {
    Node<T> *p = this->mpTail;

    Node<T> *tmp = new Node<T>{ data, nullptr, p };

    this->mpTail->mpNext = tmp;
    this->mpTail = tmp;
  }
}

template <typename T>
void DoublyLinkedList<T>::insert(T search, T data)
{
  if (this->mpHead == nullptr)
  {
    this->addToRear(data);
  }
  else
  {
    Node<T> *p = this->mpHead;
    while (p->nodeData != search && p->mpNext != nullptr)
    {
      p = p->mpNext;
    }

    if (p == this->mpTail)
    {
      this->addToRear(data);
      return;
    }

    Node<T> *tmp = new Node<T>{ data, p->mpNext, p };
    p->mpNext->mpPrev = tmp;
    p->mpNext = tmp;
  }
}

template <typename T>
void DoublyLinkedList<T>::deleteNode(std::optional<T> search)
{
  if (!search.has_value())  return;

  if (this->mpHead == nullptr)  return;

  if (this->mpHead == this->mpTail)
  {
    delete this->mpHead;
    this->mpHead = nullptr;
    this->mpTail = nullptr;
    return;
  }

  if (this->mpHead->nodeData == search)
  {
    Node<T> *delPtr = this->mpHead;
    this->mpHead = this->mpHead->mpNext;
    this->mpHead->mpPrev = nullptr;
    delete delPtr;
    return;
  }

  Node<T> *p = this->mpHead;
  while (p->mpNext != nullptr && p->mpNext->nodeData != search)
  {
    p = p->mpNext;
  }

  if (p->mpNext == nullptr)  return;

  Node<T> *delPtr = p->mpNext;
  p->mpNext = delPtr->mpNext;
  if (delPtr->mpNext != nullptr)
  {
    delPtr->mpNext->mpPrev = p;
  }
  else
  {
    this->mpTail = p;
  }
  delete delPtr;
}

#endif
