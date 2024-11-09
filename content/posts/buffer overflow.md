---
title: "Buffer Overflow"
date: 2024-11-07T00:00:00Z
draft: true
type: "post"
---

Everyone and their mother seems to write about buffer overflows at some point. It's 2024 and I'm super late to the game, it seems buffer overflows become less and less important. Well here's my write up of buffer overflows based on the old *OffSec PEN200* courseware.

The point of exploiting a buffer overflow vulnerability is to get control of registers focusing on the **ESP**, **EBP**, and **EIP** registers. As a hacker I can confirm I have control of these registers if the value within them is what I've injected. For the purposes of exploitation, controlling these registers 
* **ESP**: The stack is used for storage of data, pointers, and arguments. The stack pointer points to the top of the stack
* **EBP**: Stores the pointer to the top of the stack when a function is called.
* **EIP**: Points to the next code instruction to be executed. If the attacker controls this they control what will be executed.

There's three binaries and I'm just going to write-up my steps here.

# Vuln1 #

Given the information that I have a vulnerable app, listening on port 7001. I feed it 
