pragma solidity ^0.5.0;

contract College {
    
    string public name;
    
    uint public studentCount = 0;
    
    mapping(uint => Student) public students;
    
    struct Student {
         uint id;
         string name;
         string image;
         string rollno;
         string class;
         address student;
    }
    
    event studentCreated (
         uint id,
         string name,
         string image,
         string rollno,
         string class,
         address student
    );
    
    constructor() public {
        name = "College";
    }
    
     function createStudent(string memory _name, string memory _image, string memory _rollno, string memory _class) public {
         
        require(bytes(_name).length > 0);
        
        require(bytes(_class).length > 0);
        
        require(bytes(_image).length > 0);
        
        require(bytes(_rollno).length > 0);
        
        studentCount ++;
        
        students[studentCount] = Student(studentCount, _name, _image, _rollno, _class, msg.sender);
        
        emit studentCreated(studentCount, _name, _image, _rollno, _class, msg.sender);
     }
}