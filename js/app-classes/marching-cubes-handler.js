define(
function()
{
	var MarchingCubesHandler = function()
	{
		var that = this;
		var num_points = 10;
		var x_min = -2;
		var x_max = 2;
		var y_min = -2;
		var y_max = 2;
		var z_min = -2;
		var z_max = 2;

		var cube_x = [];
		var cube_y = [];
		var cube_z = [];

		that.marchingCubes = function(evaluate_function)
		{

		}

		function generateTetrahedron(evaluate_function,v1i,v2i,v3i,v4i)
		{
			return [];
			var points = [];
			var evaluation = [];
			var coord_x = [];
			var coord_y = [];
			var coord_z = [];

			var insertedPoints = 0;

			coord_x.push(cube_x[v1i]);
			coord_x.push(cube_x[v2i]);
			coord_x.push(cube_x[v3i]);
			coord_x.push(cube_x[v4i]);

			coord_y.push(cube_y[v1i]);
			coord_y.push(cube_y[v2i]);
			coord_y.push(cube_y[v3i]);
			coord_y.push(cube_y[v4i]);

			coord_z.push(cube_z[v1i]);
			coord_z.push(cube_z[v2i]);
			coord_z.push(cube_z[v3i]);
			coord_z.push(cube_z[v4i]);

			evaluation.push(evaluate_function(cube_x[v1i],cube_y[v1i],cube_z[v1i]));
			evaluation.push(evaluate_function(cube_x[v2i],cube_y[v2i],cube_z[v2i]));
			evaluation.push(evaluate_function(cube_x[v3i],cube_y[v3i],cube_z[v3i]));
			evaluation.push(evaluate_function(cube_x[v4i],cube_y[v4i],cube_z[v4i]));

			function computeEdge(i1,i2)
			{
				if(evaluation[i1]*evaluation[i2]<0)
				{
					var t = -evaluation[i1]/(evaluation[i2]-evaluation[i1]);

					points.push(coord_x[i1] + t * (coord_x[i2]-coord_x[i1]));
					points.push(coord_y[i1] + t * (coord_y[i2]-coord_y[i1]));
					points.push(coord_z[i1] + t * (coord_z[i2]-coord_z[i1]));

					insertedPoints++;
				}
			}

			computeEdge(0,1);
			computeEdge(0,2);
			computeEdge(0,3);
			computeEdge(1,2);
			computeEdge(1,3);
			computeEdge(2,3);

			//LINES
			if(insertedPoints==3)
			{
				points.push(points[0]);
				points.push(points[1]);
				points.push(points[2]);
				points.push(points[3]);
				points.push(points[4]);
				points.push(points[5]);
				points.push(points[6]);
				points.push(points[7]);
				points.push(points[8]);
			}
			if(insertedPoints==4)
			{
				points.push(points[9]);
				points.push(points[10]);
				points.push(points[11]);
				points.push(points[0]);
				points.push(points[1]);
				points.push(points[2]);
				points.push(points[6]);
				points.push(points[7]);
				points.push(points[8]);
				points.push(points[3]);
				points.push(points[4]);
				points.push(points[5]);
			}

			//TRIANGLES
			/*
			if(insertedPoints==4)
			{
				points.push(points[6]);
				points.push(points[7]);
				points.push(points[8]);
				points.push(points[0]);
				points.push(points[1]);
				points.push(points[2]);
			}
			*/

			if(insertedPoints!=3 && insertedPoints!=4 && insertedPoints!=0)
			{
				points = [];
			};

			/*
			if(insertedPoints==4)
			{
				points.push(points[6]);
				points.push(points[7]);
				points.push(points[8]);
				points.push(points[0]);
				points.push(points[1]);
				points.push(points[2]);
			}
			*/

			return points;
		}

		function concat(array_1,array_2)
		{

		}

		that.marchingTetrahedron = function(evaluate_function)
		{
			var points = [];

			var dx = (x_max - x_min)/num_points;
			var dy = (y_max - y_min)/num_points;
			var dz = (z_max - z_min)/num_points;

			for(var ix=0;ix<num_points;ix++)
			{
				for(var iy=0;iy<num_points;iy++)
				{
					for(var iz=0;iz<num_points;iz++)
					{
						var xb = x_min + ix*dx;
						var yb = y_min + iy*dy;
						var zb = z_min + iz*dz;
						var vertices_of_tetrahedron = [];

						cube_x = [xb,xb+dx,xb+dx,xb,xb,xb+dx,xb+dx,xb];
						cube_y = [yb,yb,yb+dy,yb+dy,yb,yb,yb+dy,yb+dy];
						cube_z = [zb,zb,zb,zb,zb+dz,zb+dz,zb+dz,zb+dz];

						//for(var i=0;i<8;i++) alert(cube_x[i]+" "+cube_y[i]+" "+cube_z[i]);
						var vertice_um;
						var vertice_dois;
						vertice_um=0;
						vertice_dois=1;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=1;vertice_dois=2;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=2;vertice_dois=3;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=3;vertice_dois=0;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=4;vertice_dois=5;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=5;vertice_dois=6;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=6;vertice_dois=7;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=7;vertice_dois=4;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=0;vertice_dois=4;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=1;vertice_dois=5;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=2;vertice_dois=6;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=3;vertice_dois=7;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);
						vertice_um=0;vertice_dois=6;
						points.push(cube_x[vertice_um]);
						points.push(cube_y[vertice_um]);
						points.push(cube_z[vertice_um]);
						points.push(cube_x[vertice_dois]);
						points.push(cube_y[vertice_dois]);
						points.push(cube_z[vertice_dois]);

						vertices_of_tetrahedron = generateTetrahedron(evaluate_function,0,1,5,6);
						for(var i=0;i<vertices_of_tetrahedron.length;i++)
						{
							points.push(vertices_of_tetrahedron[i]);
						}

						vertices_of_tetrahedron = generateTetrahedron(evaluate_function,0,4,5,6);
						for(var i=0;i<vertices_of_tetrahedron.length;i++)
						{
							points.push(vertices_of_tetrahedron[i]);
						}

						vertices_of_tetrahedron = generateTetrahedron(evaluate_function,0,1,2,6);
						for(var i=0;i<vertices_of_tetrahedron.length;i++)
						{
							points.push(vertices_of_tetrahedron[i]);
						}

						vertices_of_tetrahedron = generateTetrahedron(evaluate_function,0,3,2,6);
						for(var i=0;i<vertices_of_tetrahedron.length;i++)
						{
							points.push(vertices_of_tetrahedron[i]);
						}

						vertices_of_tetrahedron = generateTetrahedron(evaluate_function,0,4,7,6);
						for(var i=0;i<vertices_of_tetrahedron.length;i++)
						{
							points.push(vertices_of_tetrahedron[i]);
						}

						vertices_of_tetrahedron = generateTetrahedron(evaluate_function,0,3,7,6);
						for(var i=0;i<vertices_of_tetrahedron.length;i++)
						{
							points.push(vertices_of_tetrahedron[i]);
						}
					}	
				}
			}

			return points;
		}
	}
	return MarchingCubesHandler;	
});
