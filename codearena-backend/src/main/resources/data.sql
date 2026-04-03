-- Seed data for CodeArena
-- Problems will be inserted only if the problems table is empty

INSERT IGNORE INTO problems (id, title, description, difficulty, sample_input, sample_output, constraints, created_at) VALUES
(1, 'Two Sum',
'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nReturn the answer as two space-separated indices (0-indexed).\n\n**Example:**\n```\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: 0 1\n```\nBecause nums[0] + nums[1] == 9, we return 0 1.',
'EASY',
'4\n2 7 11 15\n9',
'0 1',
'2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
NOW()),

(2, 'FizzBuzz',
'Write a program that prints numbers from 1 to N. But for multiples of 3, print "Fizz" instead of the number, for multiples of 5 print "Buzz", and for numbers which are multiples of both 3 and 5, print "FizzBuzz".\n\n**Example:**\n```\nInput: 5\nOutput:\n1\n2\nFizz\n4\nBuzz\n```',
'EASY',
'5',
'1\n2\nFizz\n4\nBuzz',
'1 <= N <= 10^5',
NOW()),

(3, 'Palindrome Check',
'Given a string `s`, determine if it is a palindrome. A palindrome reads the same forwards and backwards.\n\nConsider only alphanumeric characters and ignore cases.\n\nPrint "true" if the string is a palindrome, "false" otherwise.\n\n**Example:**\n```\nInput: racecar\nOutput: true\n```',
'EASY',
'racecar',
'true',
'1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.',
NOW()),

(4, 'Reverse Linked List',
'Given a space-separated list of integers representing a singly linked list, reverse the list and print the result as space-separated values.\n\n**Example:**\n```\nInput: 1 2 3 4 5\nOutput: 5 4 3 2 1\n```',
'MEDIUM',
'1 2 3 4 5',
'5 4 3 2 1',
'The number of nodes is in range [0, 5000]\n-5000 <= Node.val <= 5000',
NOW()),

(5, 'Maximum Subarray',
'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and print that sum.\n\n**Example:**\n```\nInput: 9\n-2 1 -3 4 -1 2 1 -5 4\nOutput: 6\n```\nExplanation: The subarray [4,-1,2,1] has the largest sum = 6.',
'MEDIUM',
'9\n-2 1 -3 4 -1 2 1 -5 4',
'6',
'1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
NOW()),

(6, 'Longest Common Subsequence',
'Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, print 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n\n**Example:**\n```\nInput:\nabcde\nace\nOutput: 3\n```\nThe longest common subsequence is "ace" and its length is 3.',
'HARD',
'abcde\nace',
'3',
'1 <= text1.length, text2.length <= 1000\ntext1 and text2 consist of only lowercase English characters.',
NOW());


-- Test cases for Two Sum
INSERT IGNORE INTO test_cases (id, problem_id, input, expected_output, is_hidden, order_index) VALUES
(1, 1, '4\n2 7 11 15\n9', '0 1', false, 1),
(2, 1, '3\n3 2 4\n6', '1 2', false, 2),
(3, 1, '2\n3 3\n6', '0 1', true, 3),
(4, 1, '5\n1 5 3 7 2\n8', '1 4', true, 4);

-- Test cases for FizzBuzz
INSERT IGNORE INTO test_cases (id, problem_id, input, expected_output, is_hidden, order_index) VALUES
(5, 2, '5', '1\n2\nFizz\n4\nBuzz', false, 1),
(6, 2, '15', '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', false, 2),
(7, 2, '1', '1', true, 3),
(8, 2, '3', '1\n2\nFizz', true, 4);

-- Test cases for Palindrome Check
INSERT IGNORE INTO test_cases (id, problem_id, input, expected_output, is_hidden, order_index) VALUES
(9, 3, 'racecar', 'true', false, 1),
(10, 3, 'hello', 'false', false, 2),
(11, 3, 'A', 'true', true, 3),
(12, 3, 'abba', 'true', true, 4);

-- Test cases for Reverse Linked List
INSERT IGNORE INTO test_cases (id, problem_id, input, expected_output, is_hidden, order_index) VALUES
(13, 4, '1 2 3 4 5', '5 4 3 2 1', false, 1),
(14, 4, '1 2', '2 1', false, 2),
(15, 4, '1', '1', true, 3),
(16, 4, '10 20 30 40 50 60', '60 50 40 30 20 10', true, 4);

-- Test cases for Maximum Subarray
INSERT IGNORE INTO test_cases (id, problem_id, input, expected_output, is_hidden, order_index) VALUES
(17, 5, '9\n-2 1 -3 4 -1 2 1 -5 4', '6', false, 1),
(18, 5, '1\n1', '1', false, 2),
(19, 5, '5\n5 4 -1 7 8', '23', true, 3),
(20, 5, '3\n-1 -2 -3', '-1', true, 4);

-- Test cases for LCS
INSERT IGNORE INTO test_cases (id, problem_id, input, expected_output, is_hidden, order_index) VALUES
(21, 6, 'abcde\nace', '3', false, 1),
(22, 6, 'abc\nabc', '3', false, 2),
(23, 6, 'abc\ndef', '0', true, 3),
(24, 6, 'bsbininm\njmjkbkjkv', '1', true, 4);
