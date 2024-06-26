use db2024_01
go

declare @Search varchar(100) = ''
declare @PageSize int = 10;
declare @PageNumber int = 1;
declare @Sort varchar(40) = 'EmployeeId'


select EmployeeId,
       FirstName,
       LastName,
       Salary,
       (@PageSize * (@PageNumber - 1) + 1) AS StartRow,
       least((@PageSize * @PageNumber), TotalRows) AS EndRow,
       TotalRows
from (
     select EmployeeId,
            FirstName,
            LastName,
            Salary,
            count(*) over () AS TotalRows,
            row_number() over (
                order by
                  case when @Sort = 'EmployeeId' then EmployeeId end,
                  case when @Sort = 'EmployeeIdDesc' then EmployeeId end desc,
                  case when @Sort = 'FirstName' then FirstName end,
                  case when @Sort = 'FirstNameDesc'  then FirstName end desc,
                  case when @Sort = 'LastName'  then LastName end,
                  case when @Sort = 'LastNameDesc'  then LastName end desc,
                  case when @Sort = 'Salary'  then Salary end,
                  case when @Sort = 'SalaryDesc'  then Salary end desc
                ) AS rn
     from Employee
     where 1 = 1
     and (
            EmployeeID like '%' + @Search + '%'
         OR FirstName like '%' + @Search + '%'
         OR LastName like '%' + @Search + '%'
         OR Salary like '%' + @Search + '%'
         )
     ) x
where rn between (@PageSize * (@PageNumber - 1) + 1) and (@PageSize * @PageNumber)
order by rn

