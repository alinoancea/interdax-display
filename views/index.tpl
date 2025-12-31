<!DOCTYPE html>
<html class="h-100">
<head>
    <title>{{gama1}} &amp; {{gama2}}</title>
    <link href="static/css/bootstrap.min.css" rel="stylesheet">
    <link href="static/css/styles.css" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body class="h-100">
    <div class="container-fluid h-100">
        <div class="row row-cols-2 h-100">
            <div class="col{{gama1_dim}} border-right border-white border-2 header p-0" style="height: 150px;">
                {{gama1}}
            </div>
            <div class="col{{gama2_dim}} header p-0" style="height: 150px;">
                {{gama2}}
            </div>
            <div class="col{{gama1_dim}} border-right border-top border-white border-2 h-100 p-0 left-middle-side">
                <div class="container-fluid">
                    <div class="row row-cols-{{gama1_row}} left-elements">
                    </div>
                </div>
            </div>
            <div class="col{{gama2_dim}} border-top border-white border-2 p-0 right-middle-side">
                <div class="container-fluid">
                    <div class="row row-cols-{{gama2_row}} right-elements">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="static/js/jquery-3.5.1.min.js"></script>
    <script src="static/js/bootstrap.bundle.min.js"></script>
    <script src="static/js/app.js"></script>
</body>
</html>
