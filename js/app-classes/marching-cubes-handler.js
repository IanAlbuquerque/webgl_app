define(
function()
{
	var MarchingCubesHandler = function()
	{
		var that = this;
		var num_points = 50;
		var x_min = -2;
		var x_max = 2;
		var y_min = -2;
		var y_max = 2;
		var z_min = -2;
		var z_max = 2;


		that.marchingCubes = function(evaluate_function)
		{

		}

		var cube_x = [];
		var cube_y = [];
		var cube_z = [];

		function add_vertex_to_cube(x,y,z)
		{
			cube_x.push(x);
			cube_y.push(y);
			cube_z.push(z);
		}

		function generateTetrahedron(evaluate_function,v1i,v2i,v3i,v4i)
		{
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
			computeEdge(1,2);
			computeEdge(2,0);
			computeEdge(0,3);
			computeEdge(3,2);
			computeEdge(3,1);

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

						cube_x = [];
						cube_y = [];
						cube_z = [];

						add_vertex_to_cube(xb,yb,zb);
						add_vertex_to_cube(xb+dx,yb,zb);
						add_vertex_to_cube(xb+dx,yb+dy,zb);
						add_vertex_to_cube(xb,yb+dy,zb);

						add_vertex_to_cube(xb,yb,zb+dz);
						add_vertex_to_cube(xb+dx,yb,zb+dz);
						add_vertex_to_cube(xb+dx,yb+dy,zb+dz);
						add_vertex_to_cube(xb,yb+dy,zb+dz);

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
