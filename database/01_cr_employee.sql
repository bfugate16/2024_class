use db2024_01
GO

--drop table Employee;

create table Employee
(
EmployeeId int identity(1,1) not null,
FirstName varchar(20) null,
LastName varchar(30) null,
Salary decimal(8,2) null,
constraint Employee_pk primary key (EmployeeId)
)
;

insert into Employee
(
FirstName,
LastName,
Salary
)
select 'Nikola' AS FirstName, 'Jokic' AS LastName, 99.99 AS Salary
UNION ALL
select 'Luka' AS FirstName, 'Doncic' AS LastName, 88.88 AS Salary
UNION ALL
select 'Giannis' AS FirstName, 'Antetokounmpo' AS LastName, 77.77 AS Salary
UNION ALL
select 'Jayson' AS FirstName, 'Tatum' AS LastName, 66.66 AS Salary
UNION ALL
select 'Joel' AS FirstName, 'Embiid' AS LastName, 55.55 AS Salary
UNION ALL
select 'Stephen' AS FirstName, 'Curry' AS LastName, 44.44 AS Salary
UNION ALL
select 'Shai' AS FirstName, 'Gilgeous-Alexander' AS LastName, 33.33 AS Salary
UNION ALL
select 'Kevin' AS FirstName, 'Durant' AS LastName, 22.22 AS Salary
UNION ALL
select 'Devin' AS FirstName, 'Booker' AS LastName, 11.11 AS Salary
UNION ALL
select 'Anthony' AS FirstName, 'Davis' AS LastName, 10.10 AS Salary
UNION ALL
select 'Anthony' AS FirstName, 'Edwards' AS LastName, 9.09 AS Salary
UNION ALL
select 'Jimmy' AS FirstName, 'Butler' AS LastName, 8.08 AS Salary
UNION ALL
select 'Ja' AS FirstName, 'Morant' AS LastName, 7.07 AS Salary
UNION ALL
select 'Damian' AS FirstName, 'Lillard' AS LastName, 6.06 AS Salary
UNION ALL
select 'Kawhi' AS FirstName, 'Leonard' AS LastName, 5.05 AS Salary
UNION ALL
select 'Lebron' AS FirstName, 'James' AS LastName, 4.04 AS Salary
UNION ALL
select 'Trae' AS FirstName, 'Young' AS LastName, 3.03 AS Salary
UNION ALL
select 'Donovan' AS FirstName, 'Mitchell' AS LastName, 2.02 AS Salary
UNION ALL
select 'Tyrese' AS FirstName, 'Haliburton' AS LastName, 1.01 AS Salary
UNION ALL
select 'James' AS FirstName, 'Harden' AS LastName, 0.01 AS Salary
;

select *
from Employee
order by 1