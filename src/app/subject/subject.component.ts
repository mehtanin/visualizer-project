import { Renderer2, Inject, Component, OnInit } from '@angular/core';
import { SubjectService } from '../services/subject.service';
import { Network, DataSet, Node, Edge, IdType } from 'vis';
import * as $ from 'jquery';

@Component({
  selector: 'app-users',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {

  subjects: any;
  distinctSubjectList: string[] = [];
  isInitialLoading: boolean = true;

  constructor(
    private SubjectService: SubjectService
  ) { }

  ngOnInit() {
    this.getSubjects();
  }
  ngDoCheck() {
    if (this.isInitialLoading && $('.list-group-item').length) {
      $('.list-group-item').first().addClass('selected-subject');
      this.isInitialLoading = false;
    }

  }

  getSubjects() {
    this.SubjectService.getSubjects().subscribe(
      result => {
        this.subjects = result;
        for (let index = 0; index < this.subjects.data.length; index++) {
          //console.log(this.subjects.data[index].subject);
          if (this.distinctSubjectList.indexOf(this.subjects.data[index].subject) == -1)
            this.distinctSubjectList.push(this.subjects.data[index].subject)
        }
        //console.log(this.subjects)
        this.defaultSubjectClicked();
      },
      err => console.log(err)
    )
  }

  defaultSubjectClicked(): void {
    let subject = this.distinctSubjectList[0];
    let objectList = [];
    for (let index = 0; index < this.subjects.data.length; index++) {
      if (this.subjects.data[index].subject.indexOf(subject) != -1) {
        objectList.push({ predicate: this.subjects.data[index].predicate, object: this.subjects.data[index].object });
      }
    }

    var nodes = new DataSet([{ id: 1, label: subject, color: '#ECD4DE', heightConnstraint: 10 }]);
    for (let index = 0; index < objectList.length; index++) {
      nodes.add({ id: index + 2, label: objectList[index].object, color: '#8DC3F7', heightConnstraint: 10 })
    }

    var edges = new DataSet([{ from: 0, to: 0, label: '' }
    ]);
    for (let index = 0; index < objectList.length; index++) {
      edges.add({ from: 1, to: index + 2, label: objectList[index].predicate })
    }

    let container = document.getElementById('mynetwork')!;
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {};
    var network = new Network(container, data, options);
  }

  onSubjectClicked(event: any): void {
    $('.list-group-item').removeClass('selected-subject')
    $(event.target).addClass('selected-subject');
    let subject = event.target.innerText;
    let objectList = [];
    for (let index = 0; index < this.subjects.data.length; index++) {
      if (this.subjects.data[index].subject.indexOf(subject) != -1) {
        objectList.push({ predicate: this.subjects.data[index].predicate, object: this.subjects.data[index].object });
      }
    }

    var nodes = new DataSet([{ id: 1, label: subject, color: '#ECD4DE', heightConnstraint: 10 }]);
    for (let index = 0; index < objectList.length; index++) {
      nodes.add({ id: index + 2, label: objectList[index].object, color: '#8DC3F7', heightConnstraint: 10 })
    }

    var edges = new DataSet([{ from: 0, to: 0, label: '' }
    ]);
    for (let index = 0; index < objectList.length; index++) {
      edges.add({ from: 1, to: index + 2, label: objectList[index].predicate })
    }

    let container = document.getElementById('mynetwork')!;
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {};
    var network = new Network(container, data, options);
  }

}