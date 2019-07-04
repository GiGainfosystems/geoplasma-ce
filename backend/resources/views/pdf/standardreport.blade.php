
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<style>

table, div, p{
  font-family: DejaVu Sans;
  font-size: 14px;
  color: #777;
}

table, tr, td {
  page-break-inside: auto;
}

.explanatory-notes {
  page-break-before: always;
}

h1, h3 {
  font-family: DejaVu Sans;
  font-size: 16px;
  padding: 10px;
  width:100%;
  margin-bottom: 0;
  background: #00163dcc;
  color: #fafafa;
}



.pdf-table {
  display: table;
  width: 100%;
}

.info-table {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-top: 10px;
  padding-top: 10px;
}

.info-table td span {
  margin-right: 10px;
}

.tooltip-note {
  display: none;
}

td span {
  display: inline-block;
  width: 40px;
  height: 40px;
}

table {
  width: 100%;
}

.attribute-table table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.attribute-table table tr:nth-child(2n) td {
  background: #f3f3f3;
}

.text-right {
  text-align: right;
}

.report-flexbox {
  display: table-row;
}

.report-legend, .coordinates {
  display: table-cell;
  width: 50%;
}

ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

ul li {
  margin-bottom: 10px;
}

.coordinates p {
  padding: 0;
  margin: 10px 0;
}

.report-legend ul li span {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 99px;
  margin-right: 10px;
}

.coordinates {
  text-align: right;
}

tbody:before, tbody:after { display: none; }

.page-break {
  page-break-before: always;
}

#borehole {
  display: none;
}

.borehole-section {
  page-break-before: always;
  page-break-after: always;
  position: relative;
}

.borehole-info {
  display: none;
}

.borehole-section h3 {
  
}

.borehole-section img {
  max-height: 850px;
}

td.unit-color {
    max-width: 100px;
    opacity: 0;
    color: rgba(0,0,0,0); 
}

.unit-table tr:last-child td {
    border-bottom: 0;
}

.btn-blue {
  display: none;
}

.unit-table {
  border: 1px solid #aaa;
}

.unit-table tr td {
  padding: 10px;
  font-size: 10px; 
  border-bottom: 1px solid #aaa;
}

.unit-table tr td p {
  margin: 0;
  padding: 0;
}

.units {
  width: 400px;
  position: absolute; 
  top: 60px;
  right: 20px;
}

#borehole_picture {
  position: absolute;
  left: 20px;
  top: 60px;
}

.borehole-section, .borehole-and-legend {
  width: 100%;
}

.explanatory-note {
  display: none;
}

</style>

<h1>{{ $headline }}<span></span></h1>
<img src="{{ $image }}" style="width:100%;" />

{!! $html !!}

<div class="explanatory-notes">
  <h3>{{ $exNotesHeadline }}</h3>
  @foreach($notes as $note)
    <p>
      <strong>{{ $note['name'] }}</strong><br />
      {{ $note['description'] }}
    </p>
  @endforeach
</div>