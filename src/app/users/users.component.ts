import { Renderer2, Inject, Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Network, DataSet, Node, Edge, IdType } from 'vis';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  subjects: any;
  distinctSubjectList: string[] = [];

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.usersService.getUsers().subscribe(
      result => {
        this.subjects = result;
        for (let index = 0; index < this.subjects.data.length; index++) {
          //console.log(this.subjects.data[index].subject);
          if (this.distinctSubjectList.indexOf(this.subjects.data[index].subject) == -1)
            this.distinctSubjectList.push(this.subjects.data[index].subject)
        }
        console.log(this.subjects)
      },
      err => console.log(err)
    )
  }

  onSubjectClicked(subject: string): void {
    let objectList = [];
    for (let index = 0; index < this.subjects.data.length; index++) {
      if (this.subjects.data[index].subject.indexOf(subject) != -1) {
        objectList.push({ predicate: this.subjects.data[index].predicate, object: this.subjects.data[index].object });
      }
    }
    console.log(objectList);

    var nodes = new DataSet([{ id: 1, label: subject, color: '#ffcccc', heightConnstraint: 10 }]);
    for (let index = 0; index < objectList.length; index++) {
      nodes.add({ id: index + 2, label: objectList[index].object, color: '#80dfff', heightConnstraint: 10 })
    }
    // create an array with edges
    var edges = new DataSet([{ from: 0, to: 0, label: '' }
    ]);
    for (let index = 0; index < objectList.length; index++) {
      edges.add({ from: 1, to: index + 2, label: objectList[index].predicate })
    }

    // create a network
    let container = document.getElementById('mynetwork')!;
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {};
    var network = new Network(container, data, options);
  }

}